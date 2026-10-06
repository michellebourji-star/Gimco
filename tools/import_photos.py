"""Convert product photos (PNG/JPG with black or transparent borders) into
clean square JPGs for the website, and record them in tools/photo-manifest.json.

Usage: python3 tools/import_photos.py batch.json
batch.json = [{"src": "path/to/photo.png", "name": "file-name-without-ext", "title": "Product title", "category": "car|truck|tools", "type": "type-id"}]
"""
import json, os, sys
from PIL import Image, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "images", "products")
MANIFEST = os.path.join(ROOT, "tools", "photo-manifest.json")


def convert(src, dest):
    im = Image.open(src).convert("RGBA")
    rgb = im.convert("RGB")
    alpha = im.split()[3].point(lambda v: 255 if v > 10 else 0)
    bright = rgb.convert("L").point(lambda v: 255 if v > 18 else 0)
    box = ImageChops.multiply(bright, alpha).getbbox() or (0, 0, *im.size)
    crop = im.crop(box)
    flat = Image.new("RGB", crop.size, "white")
    flat.paste(crop.convert("RGB"), (0, 0), crop.split()[3])
    side = max(flat.size)
    square = Image.new("RGB", (side, side), "white")
    square.paste(flat, ((side - flat.width) // 2, (side - flat.height) // 2))
    if side > 1000:
        square = square.resize((1000, 1000), Image.LANCZOS)
    square.save(dest, "JPEG", quality=85, optimize=True, progressive=True)


def main(batch_file):
    batch = json.load(open(batch_file))
    manifest = json.load(open(MANIFEST)) if os.path.exists(MANIFEST) else []
    for item in batch:
        convert(item["src"], os.path.join(OUT, item["name"] + ".jpg"))
        entry = {k: v for k, v in item.items() if k != "src"}
        manifest = [m for m in manifest if m["name"] != entry["name"]] + [entry]
        print("ok", item["name"])
    json.dump(manifest, open(MANIFEST, "w"), indent=2)
    print(len(manifest), "photos in manifest")


if __name__ == "__main__":
    main(sys.argv[1])
