"""Recorta frasco y decant de cada escena en photos-raw/ (plan §6).

Uso:
    scripts/photos/.venv/Scripts/python scripts/photos/cutout.py [salida]

Por cada photos-raw/<slug>.png genera en <salida>/<slug>/:
    mask.png     máscara completa del modelo (para depurar)
    bottle.png   frasco recortado, sin fondo
    decant.png   decant recortado, sin fondo
    review.png   hoja de revisión sobre fondo ink y gris medio (CA-IMG.1)
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "photos-raw"
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "photos-out"

INK = (12, 20, 38)
GRAY = (128, 128, 128)
PAD = 12  # px de aire alrededor de cada recorte


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


def objects_from_mask(alpha: np.ndarray, count: int = 2):
    """Las `count` regiones más grandes de la máscara, ordenadas de izquierda a derecha."""
    solid = alpha > 40
    labels, n = ndimage.label(solid)
    sizes = ndimage.sum(solid, labels, range(1, n + 1)) if n else []
    # un segundo objeto mucho menor que el primero = frasco y decant pegados
    if n < count or sorted(sizes)[-2] < 0.15 * max(sizes):
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
    for src in sorted(RAW.glob("*.png")):
        slug = src.stem
        dest = OUT / slug
        dest.mkdir(parents=True, exist_ok=True)

        scene = Image.open(src).convert("RGB")
        mask = remove(scene, session=session, only_mask=True)
        mask.save(dest / "mask.png")

        rgb = np.asarray(scene)
        alpha = np.asarray(mask)
        found = objects_from_mask(alpha)
        if not found or len(found[0]) < 2:
            print(f"{slug}: no se separaron 2 objetos, revisar mask.png")
            continue
        boxes, labels = found
        bottle = crop_object(rgb, alpha, labels, boxes[0][0], boxes[0])
        decant = crop_object(rgb, alpha, labels, boxes[1][0], boxes[1])
        bottle.save(dest / "bottle.png")
        decant.save(dest / "decant.png")
        review_sheet([bottle, decant]).save(dest / "review.png")
        print(f"{slug}: frasco {bottle.size}, decant {decant.size}")


if __name__ == "__main__":
    main()
