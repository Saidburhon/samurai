"""Side-by-side pairs for the material lock (§0.1, G1): the prototype frame downscaled to the production frame's size
(Lanczos), next to the production frame, at the capture's resolution; plus 1:1 detail crops of the regions that decide
the lock (the blade, the tsuba, the type), and one contact sheet of every poster in the run.
Usage: python3 scripts/qa/pairs.py <poster-test out dir> <prototype shots dir>"""
import sys, os, json
from PIL import Image, ImageDraw, ImageFont

out, proto = sys.argv[1], sys.argv[2]
log = json.load(open(os.path.join(out, 'poster-log.json')))
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
except Exception:
    font = ImageFont.load_default()

# detail crops in fractions of the frame: (x0, y0, x1, y1)
CROPS = {
    '01-hero-1440.png': [(0.20, 0.44, 0.44, 0.70), (0.44, 0.30, 0.68, 0.56), (0.70, 0.16, 0.96, 0.42), (0.04, 0.56, 0.30, 0.76)],
    '02-signature-reveal-1440.png': [(0.20, 0.44, 0.44, 0.70), (0.52, 0.28, 0.80, 0.54), (0.70, 0.16, 0.96, 0.42)],
    '03-utsuri-services-1440.png': [(0.15, 0.30, 0.65, 0.70), (0.55, 0.12, 0.98, 0.45)],
    '04-tsuba-1440.png': [(0.45, 0.17, 0.80, 0.77)],
    '05-hero-phone-390.png': [(0.50, 0.10, 1.0, 0.55), (0.50, 0.55, 1.0, 1.0)],
}

# anti-aliasing crops of the frames without a prototype (production only, 3x nearest): by label prefix
AA_CROPS = {
    'B1-': [(0.62, 0.52, 0.92, 0.80), (0.25, 0.55, 0.55, 0.80)],
    'B6-': [(0.08, 0.50, 0.42, 0.88), (0.66, 0.24, 0.98, 0.48)],
    'B12-': [(0.38, 0.44, 0.66, 0.74)],
    'B21-': [(0.66, 0.60, 1.00, 0.92)],
}

def label(im, text):
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, im.width, 22), fill=(30, 30, 30))
    d.text((6, 3), text, fill=(235, 235, 235), font=font)
    return im

made = []
for f in log['frames']:
    p = os.path.join(out, f['file'])
    if not os.path.exists(p):
        continue
    prod = Image.open(p).convert('RGB')
    if f.get('proto'):
        ref = Image.open(os.path.join(proto, f['proto'])).convert('RGB').resize(prod.size, Image.LANCZOS)
        W, H = prod.size
        S = Image.new('RGB', (W * 2 + 12, H + 26), (30, 30, 30))
        S.paste(label(Image.new('RGB', (W, 22)), f'prototype {f["proto"]} (Lanczos to {W}x{H})'), (0, 0))
        S.paste(label(Image.new('RGB', (W, 22)), f'production {f["label"]} {f["layout"]} sw={log["sw"]} hold {f.get("timing", {}).get("hold")} ms'), (W + 12, 0))
        S.paste(ref, (0, 26)); S.paste(prod, (W + 12, 26))
        name = os.path.join(out, f'pair-{f["label"]}.jpg')
        S.save(name, quality=92); made.append(name)
        # 1:1 crops, prototype above production
        for i, (x0, y0, x1, y1) in enumerate(CROPS.get(f['proto'], [])):
            box = (int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H))
            a, b = ref.crop(box), prod.crop(box)
            cw, ch = a.size
            C = Image.new('RGB', (cw * 2 + 8, ch + 22), (30, 30, 30))
            C.paste(label(Image.new('RGB', (cw * 2 + 8, 22)), f'{f["label"]} crop {i + 1}: prototype | production (1:1 at capture resolution)'), (0, 0))
            C.paste(a, (0, 22)); C.paste(b, (cw + 8, 22))
            # and 2x nearest, so single device pixels can be judged
            C2 = C.resize((C.width * 2, C.height * 2), Image.NEAREST)
            n2 = os.path.join(out, f'crop-{f["label"]}-{i + 1}.png')
            C2.save(n2); made.append(n2)
    for pre, boxes in AA_CROPS.items():
        if not f['label'].startswith(pre):
            continue
        W, H = prod.size
        for i, (x0, y0, x1, y1) in enumerate(boxes):
            a = prod.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)))
            C = Image.new('RGB', (a.width, a.height + 22), (30, 30, 30))
            C.paste(label(Image.new('RGB', (a.width, 22)), f'{f["label"]} aa {i + 1} (1:1 at capture resolution)'), (0, 0))
            C.paste(a, (0, 22))
            n3 = os.path.join(out, f'aa-{f["label"]}-{i + 1}.png')
            C.resize((C.width * 3, C.height * 3), Image.NEAREST).save(n3); made.append(n3)
# the contact sheet of the run
frames = [f for f in log['frames'] if os.path.exists(os.path.join(out, f['file']))]
if frames:
    cw = 540
    cells = []
    for f in frames:
        im = Image.open(os.path.join(out, f['file'])).convert('RGB')
        h = round(im.height * cw / im.width) if im.width > im.height else 600
        w = cw if im.width > im.height else round(im.width * 600 / im.height)
        cells.append((f, im.resize((w, h), Image.LANCZOS)))
    cols = 3
    rows = [cells[i:i + cols] for i in range(0, len(cells), cols)]
    rhs = [max(c[1].height for c in r) + 30 for r in rows]
    S = Image.new('RGB', (cols * (cw + 8) + 8, sum(rhs) + 8), (30, 30, 30))
    d = ImageDraw.Draw(S)
    y = 8
    for r, rh in zip(rows, rhs):
        for j, (f, im) in enumerate(r):
            x = 8 + j * (cw + 8)
            d.text((x, y + 2), f'{f["label"]} ({f["layout"]}) hold {f.get("timing", {}).get("hold")} ms', fill=(230, 230, 230), font=font)
            S.paste(im, (x, y + 22))
        y += rh
    name = os.path.join(out, 'sheet-posters.jpg')
    S.save(name, quality=88); made.append(name)
print('\n'.join(made))
