"""Blind pairs for the material lock (G1, §8: "one blind juror agent comparing pairs").

For every poster-test frame that has a prototype frame, the prototype is downscaled to the production frame's size
(Lanczos, §0.1) and the two are laid side by side as "Left" and "Right" in a seeded random order, with no label that
says which is which. A juror scores each pair with JUROR.md (written next to the images); key.json, kept apart, says
which side is production.

G1 r2: the bars that would tell production from the prototype (the top bar, where production has SAMURAI, JA and
other clocks, and the bottom ruler, where production names the scene) are masked in both images with the ground just
inside them, and real capture frames can be added (--extra label=frame.png:prototype.png, e.g. the boot path's 3 s
frame next to prototype 02).

Usage: python3 scripts/qa/blind-pairs.py <poster-test out dir> <prototype shots dir> <pack dir> [seed]
       [--extra label=frame.png:proto.png ...] [--skip label ...] [--no-mask]
"""
import json
import os
import random
import sys

from PIL import Image, ImageDraw, ImageFont

args = [a for a in sys.argv[1:]]
extra = []
while '--extra' in args:
    i = args.index('--extra'); extra.append(args[i + 1]); del args[i:i + 2]
skip = []
while '--skip' in args:
    i = args.index('--skip'); skip.append(args[i + 1]); del args[i:i + 2]
mask = '--no-mask' not in args
args = [a for a in args if a != '--no-mask']
out, proto, pack = args[0:3]
seed = int(args[3]) if len(args) > 3 else 1
rnd = random.Random(seed)
log = json.load(open(os.path.join(out, 'poster-log.json')))
os.makedirs(os.path.join(pack, 'pairs'), exist_ok=True)
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 16)
except Exception:
    font = ImageFont.load_default()

def bands(im):
    """the top bar and the bottom ruler, filled with the ground just inside each (a vertical blend of that row)"""
    W, H = im.size
    phone = H > W
    top = round((60 if phone else 72) * (1.5 if phone else 0.75))
    bot = 0 if phone else round(40 * 0.75)
    px = im.load()
    for (y0, y1, ref) in ((0, top, min(H - 1, top + 2)), (H - bot, H, max(0, H - bot - 3))):
        if y1 <= y0:
            continue
        row = [px[x, ref] for x in range(W)]
        for y in range(y0, y1):
            for x in range(W):
                px[x, y] = row[x]
    return im


frames = [f for f in log['frames'] if f.get('proto') and f['label'] not in skip and os.path.exists(os.path.join(out, f['file']))]
for e in extra:
    label, rest = e.split('=', 1)
    fp, pp = rest.rsplit(':', 1)
    frames.append({'label': label, 'file': os.path.abspath(fp), 'proto': pp})

key, n = {}, 0
for f in frames:
    prod = Image.open(os.path.join(out, f['file'])).convert('RGB')
    ref = Image.open(os.path.join(proto, f['proto'])).convert('RGB').resize(prod.size, Image.LANCZOS)
    if mask:
        prod, ref = bands(prod), bands(ref)
    n += 1
    left_is_prod = rnd.random() < 0.5
    L, R = (prod, ref) if left_is_prod else (ref, prod)
    W, H = prod.size
    S = Image.new('RGB', (W * 2 + 16, H + 30), (24, 24, 24))
    d = ImageDraw.Draw(S)
    d.text((6, 6), 'Left', fill=(235, 235, 235), font=font)
    d.text((W + 22, 6), 'Right', fill=(235, 235, 235), font=font)
    S.paste(L, (0, 30)); S.paste(R, (W + 16, 30))
    name = f'pair-{n:02d}.png'
    S.save(os.path.join(pack, 'pairs', name))
    key[name] = {'production': 'Left' if left_is_prod else 'Right', 'frame': f['label'], 'prototype': f['proto']}

with open(os.path.join(pack, 'key.json'), 'w') as fh:
    json.dump(key, fh, indent=2)
with open(os.path.join(pack, 'pairs', 'JUROR.md'), 'w') as fh:
    fh.write("""# Blind pairs: which render is better?

Each image in this folder shows two renders of the same poster of a website, side by side ("Left" and "Right"),
at the size a juror's screenshots have (1080 x 675 desktop, 585 x 1266 phone). One is a prototype, the other a
production build; you are not told which. The top bar and the bottom ruler are blanked in both (they differ by
design, not by quality); judge the poster between them.

For every pair, judge only what is visible:
1. Materials: does the steel read as polished steel (a dark mirror with a crisp streak, a frosty temper line), the
   fittings as metal, the silk as silk, the lacquer as lacquer?
2. Pixel quality at this size: broken or dotted thin lines, salt-and-pepper sparkle noise, jagged outlines, smears.
3. Composition and typography: balance, legibility, nothing awkwardly cropped.
4. Overall: which would you rather ship as the final poster?

Answer per pair: the better side (Left, Right or Equal), a 1-10 score for each side, and one line on the deciding
difference. Look at full size (open the PNG) before answering.
""")
print(f'{n} pairs -> {pack}/pairs (key: {pack}/key.json)')
