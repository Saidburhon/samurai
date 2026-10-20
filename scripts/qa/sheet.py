"""Contact sheets for the QA probes: every <tag>-NN.png series in a folder becomes <tag>.jpg (frames in reading order).
Usage: python3 scripts/qa/sheet.py <dir> [cell width = 480]"""
import sys, os, re, glob
from collections import defaultdict
from PIL import Image

d = sys.argv[1]
cw = int(sys.argv[2]) if len(sys.argv) > 2 else 480
series = defaultdict(list)
for f in sorted(glob.glob(os.path.join(d, '*.png'))):
    m = re.match(r'(.+)-(\d\d)\.png$', os.path.basename(f))
    if m and not m.group(1).startswith('okina'):
        series[m.group(1)].append(f)
for tag, fs in series.items():
    ims = [Image.open(f).convert('RGB') for f in fs]
    w, h = ims[0].size
    ch = round(h * cw / w)
    cols = 4 if w > h else 8
    rows = (len(ims) + cols - 1) // cols
    S = Image.new('RGB', (cols * (cw + 6) + 6, rows * (ch + 6) + 6), (48, 48, 48))
    for i, im in enumerate(ims):
        S.paste(im.resize((cw, ch), Image.LANCZOS), (6 + (i % cols) * (cw + 6), 6 + (i // cols) * (ch + 6)))
    S.save(os.path.join(d, f'sheet-{tag}.jpg'), quality=85)
oks = sorted(glob.glob(os.path.join(d, 'okina-*.png')))
if oks:
    ims = [Image.open(f).convert('RGB') for f in oks]
    sc = 3
    ims = [im.resize((im.width * sc, im.height * sc), Image.NEAREST) for im in ims]
    W = max(im.width for im in ims) + 12
    S = Image.new('RGB', (W, sum(im.height + 8 for im in ims) + 8), (255, 255, 255))
    y = 8
    for im in ims:
        S.paste(im, (6, y)); y += im.height + 8
    S.save(os.path.join(d, 'sheet-okina.png'))
print('sheets in', d)
