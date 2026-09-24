"""Recorta frasco y decant de cada escena en photos-raw/ (plan §6).

Uso:
    scripts/photos/.venv/Scripts/python scripts/photos/cutout.py [salida]

Por cada photos-raw/<slug>.png (escena con frasco y decant) genera en
<salida>/<slug>/ lo de abajo. Si el archivo se llama <slug>.frasco.png, es una
foto solo del frasco: se recorta el frasco y no se generan decant ni escena.
Si existen ambos, el frasco sale de la foto limpia y el decant de la escena.

    mask.png     máscara completa del modelo (para depurar)
    bottle.png   frasco recortado, sin fondo
    decant.png   decant recortado, sin fondo
    review.png   hoja de revisión sobre fondo ink y gris medio (CA-IMG.1)

y publica bottle.webp, decant.webp, scene.webp y og.jpg en
public/products/<slug>/, más public/og.jpg para la portada.
"""
import json
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from rembg import new_session, remove
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "photos-raw"
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "photos-out"
PUBLIC = ROOT / "public" / "products"

INK = (12, 20, 38)
GRAY = (128, 128, 128)
PAD = 12  # px de aire alrededor de cada recorte
BRAND = "Fracción"
SOLO_SUFFIX = ".frasco"  # igual que site.brandName en config/site.ts


OVERRIDES = json.loads((Path(__file__).parent / "overrides.json").read_text(encoding="utf-8"))


def apply_overrides(slug: str, alpha: np.ndarray) -> np.ndarray:
    """Conserva solo lo que está dentro de las cajas de overrides.json (si hay)."""
    boxes = OVERRIDES.get(slug, {}).get("keep")
    if not boxes:
        return alpha
    keep = np.zeros(alpha.shape, dtype=bool)
    for x0, y0, x1, y1 in boxes:
        keep[y0:y1, x0:x1] = True
    return np.where(keep, alpha, 0).astype(alpha.dtype)


def split_touching(solid: np.ndarray) -> np.ndarray:
    """Si frasco y decant se tocan, corta por la columna más angosta entre ambos.

    Busca en la mitad derecha de la imagen la columna con menos píxeles
    sólidos (el "valle" entre los dos objetos) y la vacía.
    """
    labels, n = ndimage.label(solid)
    if n == 0:
        return solid
    sizes = ndimage.sum(solid, labels, range(1, n + 1))
    main = labels == (np.argmax(sizes) + 1)
    cols = main.sum(axis=0).astype(float)
    xs = np.where(cols > 0)[0]
    lo, hi = xs.min(), xs.max()
    start, end = lo + int((hi - lo) * 0.5), lo + int((hi - lo) * 0.9)
    valley = start + int(np.argmin(cols[start:end]))
    out = solid.copy()
    out[:, max(0, valley - 1):valley + 2] = False
    return out


def objects_from_mask(alpha: np.ndarray, count: int = 2, split: bool = True):
    """Las `count` regiones más grandes de la máscara, ordenadas de izquierda a derecha."""
    solid = alpha > 40
    labels, n = ndimage.label(solid)
    sizes = ndimage.sum(solid, labels, range(1, n + 1)) if n else []
    # un segundo objeto mucho menor que el primero = frasco y decant pegados
    if split and n and (n < count or sorted(sizes)[-2] < 0.15 * max(sizes)):
        solid = split_touching(solid)
        labels, n = ndimage.label(solid)
    if n == 0:
        return []
    sizes = ndimage.sum(solid, labels, range(1, n + 1))
    biggest = np.argsort(sizes)[::-1][:count] + 1
    boxes = []
    for lab in biggest:
        ys, xs = np.where(labels == lab)
        boxes.append((lab, xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    return sorted(boxes, key=lambda b: b[1]), labels


def clean_alpha(alpha: np.ndarray, keep: np.ndarray) -> np.ndarray:
    """Deja solo la región del objeto y suaviza el borde un poco."""
    a = np.where(keep, alpha, 0).astype(np.uint8)
    img = Image.fromarray(a).filter(ImageFilter.GaussianBlur(0.6))
    return np.asarray(img)


def crop_object(rgb: np.ndarray, alpha: np.ndarray, labels, lab, box) -> Image.Image:
    _, x0, y0, x1, y1 = box
    # la región del objeto, dilatada para no perder el borde semitransparente,
    # pero sin invadir la de otro objeto (frasco y decant pueden tocarse)
    others = (labels != lab) & (labels != 0)
    region = ndimage.binary_dilation(labels == lab, iterations=4) & ~others
    a = clean_alpha(alpha, region)
    h, w = alpha.shape
    x0, y0 = max(0, x0 - PAD), max(0, y0 - PAD)
    x1, y1 = min(w, x1 + PAD), min(h, y1 + PAD)
    rgba = np.dstack([rgb, a])[y0:y1, x0:x1]
    return Image.fromarray(rgba, "RGBA")


def flatten_base(img: Image.Image, max_wobble: float = 3.0) -> Image.Image:
    """Deja recta la base del frasco solo si quedó irregular.

    Si algo tapaba la base en la escena (flores, hojas), el recorte queda
    con el borde inferior ondulado. Se mide el borde inferior en la franja
    central (los laterales pueden tener logos que sobresalen) y, si varía
    más de `max_wobble` px, se corta a la altura del punto más alto.
    """
    a = np.asarray(img)[..., 3].astype(float)
    solid = a > 128
    w = solid.shape[1]
    center = solid[:, int(w * 0.2):int(w * 0.8)]
    has = center.any(axis=0)
    if not has.any():
        return img
    bottoms = np.array([np.where(col)[0].max() for col in center.T[has]])
    if bottoms.std() <= max_wobble:  # la base ya es recta: no tocar
        return img
    base = int(bottoms.min())
    fade = 3
    a[base + 1:] = 0
    for i in range(fade):
        a[base - i] *= (i + 1) / (fade + 1)
    out = np.asarray(img).copy()
    out[..., 3] = a.astype(np.uint8)
    cropped = Image.fromarray(out, "RGBA")
    return cropped.crop((0, 0, img.width, min(img.height, base + 1 + PAD)))


def review_sheet(pieces: list[Image.Image]) -> Image.Image:
    """Cada recorte sobre ink y sobre gris, lado a lado."""
    h = max(p.height for p in pieces)
    tiles = []
    for bg in (INK, GRAY):
        for p in pieces:
            tile = Image.new("RGB", (p.width + 24, h + 24), bg)
            tile.paste(p, (12, 12 + h - p.height), p)
            tiles.append(tile)
    sheet = Image.new("RGB", (sum(t.width for t in tiles), h + 24), (40, 40, 40))
    x = 0
    for t in tiles:
        sheet.paste(t, (x, 0))
        x += t.width
    return sheet


def main():
    session = new_session("birefnet-general")
    bottles: dict[str, Image.Image] = {}
    for src in sorted(RAW.glob("*.png")):
        # <slug>.frasco.png = foto solo del frasco (sin decant ni escena)
        solo = src.stem.endswith(SOLO_SUFFIX)
        slug = src.stem.removesuffix(SOLO_SUFFIX)
        # si también hay escena, la foto solo-frasco se usa dentro de ella
        if solo and (RAW / f"{slug}.png").exists():
            continue
        dest = OUT / slug
        dest.mkdir(parents=True, exist_ok=True)

        scene = Image.open(src).convert("RGB")
        mask = remove(scene, session=session, only_mask=True)
        mask.save(dest / "mask.png")

        rgb = np.asarray(scene)
        alpha = apply_overrides(slug, np.asarray(mask))
        if solo:
            found = objects_from_mask(alpha, count=1, split=False)
            if not found:
                print(f"{slug}: no se encontró el frasco, revisar mask.png")
                continue
            boxes, labels = found
            bottle = flatten_base(crop_object(rgb, alpha, labels, boxes[0][0], boxes[0]))
            bottle.save(dest / "bottle.png")
            review_sheet([bottle]).save(dest / "review.png")
            publish(slug, bottle)
            bottles[slug] = bottle
            print(f"{slug}: frasco {bottle.size} (solo frasco)")
            continue
        found = objects_from_mask(alpha)
        if not found or len(found[0]) < 2:
            print(f"{slug}: no se separaron 2 objetos, revisar mask.png")
            continue
        boxes, labels = found
        bottle = flatten_base(crop_object(rgb, alpha, labels, boxes[0][0], boxes[0]))
        decant = crop_object(rgb, alpha, labels, boxes[1][0], boxes[1])
        # Si la escena tapa el frasco (adornos delante), y hay una foto limpia
        # solo del frasco (<slug>.frasco.png), el frasco sale de esa foto.
        clean = RAW / f"{slug}{SOLO_SUFFIX}.png"
        if clean.exists():
            solo_img = Image.open(clean).convert("RGB")
            solo_alpha = np.asarray(remove(solo_img, session=session, only_mask=True))
            solo_found = objects_from_mask(solo_alpha, count=1, split=False)
            if solo_found:
                b, lab = solo_found
                bottle = flatten_base(crop_object(np.asarray(solo_img), solo_alpha, lab, b[0][0], b[0]))
        bottle.save(dest / "bottle.png")
        decant.save(dest / "decant.png")
        review_sheet([bottle, decant]).save(dest / "review.png")
        publish(slug, bottle, decant, scene)
        bottles[slug] = bottle
        print(f"{slug}: frasco {bottle.size}, decant {decant.size}")

    # La imagen de la portada muestra 3 frascos: los primeros del catálogo.
    ordered = [bottles[slug] for slug in PRODUCT_INFO if slug in bottles][:3]
    if ordered:
        og_home(ordered).save(ROOT / "public" / "og.jpg", quality=88)


def publish(slug: str, bottle: Image.Image, decant: Image.Image | None = None, scene: Image.Image | None = None):
    """Exporta a WebP en public/products/<slug>/ (lo que usa el sitio)."""
    dest = PUBLIC / slug
    dest.mkdir(parents=True, exist_ok=True)
    bottle.save(dest / "bottle.webp", quality=88, method=6)
    if decant:
        decant.save(dest / "decant.webp", quality=88, method=6)
    if scene:
        scene.save(dest / "scene.webp", quality=82, method=6)
    info = PRODUCT_INFO.get(slug)
    if info:
        og_product(bottle, *info).save(dest / "og.jpg", quality=88)


# ---------- Imágenes para compartir (Open Graph, CA-7.1 y CA-7.2) ----------

OG_SIZE = (1200, 630)
FONTS = Path(__file__).parent / "fonts"
PEARL = (238, 241, 244)
MIST = (138, 151, 173)
BRASS_LIT = (235, 212, 154)


def read_product_info() -> dict[str, tuple[str, str]]:
    """slug → (nombre, marca), leído de data/products.ts."""
    text = (ROOT / "data" / "products.ts").read_text(encoding="utf-8")
    entries = re.findall(r'slug: "([^"]+)",\s*name: "([^"]+)",\s*brand: "([^"]+)"', text)
    return {slug: (name, brand) for slug, name, brand in entries}


PRODUCT_INFO = read_product_info()


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONTS / f"{name}.ttf"), size)


def og_canvas() -> Image.Image:
    """Fondo ink con el resplandor del foco, como el hero."""
    w, h = OG_SIZE
    y, x = np.mgrid[0:h, 0:w]
    glow = np.exp(-(((x - w * 0.68) / (w * 0.30)) ** 2 + ((y + h * 0.1) / (h * 0.9)) ** 2))
    base = np.array(INK, dtype=float)
    light = np.array((60, 76, 104), dtype=float)
    img = base + glow[..., None] * (light - base)
    return Image.fromarray(img.clip(0, 255).astype(np.uint8), "RGB")


def place_bottle(canvas: Image.Image, bottle: Image.Image, center_x: int, height: int, floor: int):
    scale = height / bottle.height
    b = bottle.resize((round(bottle.width * scale), height), Image.LANCZOS)
    canvas.paste(b, (center_x - b.width // 2, floor - height), b)


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt, max_width: int) -> list[str]:
    lines, current = [], ""
    for word in text.split():
        trial = f"{current} {word}".strip()
        if draw.textlength(trial, font=fnt) <= max_width or not current:
            current = trial
        else:
            lines.append(current)
            current = word
    return lines + [current]


def og_product(bottle: Image.Image, name: str, brand: str) -> Image.Image:
    img = og_canvas()
    place_bottle(img, bottle, center_x=880, height=520, floor=585)
    d = ImageDraw.Draw(img)
    d.text((80, 150), brand, font=font("InstrumentSans", 32), fill=MIST)
    # nombres largos: se achica la letra hasta que quepa en dos líneas
    for size in (84, 72, 62, 54):
        title = font("BodoniModa", size)
        lines = wrap(d, name, title, 560)
        if len(lines) <= 2:
            break
    y = 200
    for line in lines:
        d.text((76, y), line, font=title, fill=PEARL)
        y += round(size * 1.1)
    d.text((80, y + 24), "Decant de 10 ml de perfume original", font=font("InstrumentSans", 30), fill=BRASS_LIT)
    d.text((80, 520), BRAND, font=font("BodoniModa", 40), fill=PEARL)
    return img


def og_home(bottles: list[Image.Image]) -> Image.Image:
    img = og_canvas()
    d = ImageDraw.Draw(img)
    mark = font("BodoniModa", 230)
    tw = d.textlength(BRAND, font=mark)
    d.text(((OG_SIZE[0] - tw) / 2, 60), BRAND, font=mark, fill=(40, 52, 76))
    xs = [600] if len(bottles) == 1 else np.linspace(330, 870, len(bottles)).astype(int)
    order = sorted(range(len(bottles)), key=lambda i: abs(xs[i] - 600), reverse=True)
    for i in order:  # el del centro, al frente
        h = 440 if xs[i] == 600 else 330
        place_bottle(img, bottles[i], int(xs[i]), h, 540)
    tagline = "Perfumes originales en decants de 10 ml"
    f = font("InstrumentSans", 30)
    d.text(((OG_SIZE[0] - d.textlength(tagline, font=f)) / 2, 566), tagline, font=f, fill=PEARL)
    return img


if __name__ == "__main__":
    main()
