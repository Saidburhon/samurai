"""Blind pairs for the material lock (G1, §8: "one blind juror agent comparing pairs").

For every poster-test frame that has a prototype frame, the prototype is downscaled to the production frame's size
(Lanczos, §0.1) and the two are laid side by side as "Left" and "Right" in a seeded random order, with no label that
says which is which. A juror scores each pair with JUROR.md (written next to the images); key.json, kept apart, says
which side is production.

Usage: python3 scripts/qa/blind-pairs.py <poster-test out dir> <prototype shots dir> <pack dir> [seed]
"""
import json
import os
import random
import sys

from PIL import Image, ImageDraw, ImageFont

out, proto, pack = sys.argv[1:4]
seed = int(sys.argv[4]) if len(sys.argv) > 4 else 1
rnd = random.Random(seed)
log = json.load(open(os.path.join(out, 'poster-log.json')))
os.makedirs(os.path.join(pack, 'pairs'), exist_ok=True)
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 16)
except Exception:
    font = ImageFont.load_default()

key, n = {}, 0
for f in log['frames']:
    if not f.get('proto') or not os.path.exists(os.path.join(out, f['file'])):
        continue
    prod = Image.open(os.path.join(out, f['file'])).convert('RGB')
    ref = Image.open(os.path.join(proto, f['proto'])).convert('RGB').resize(prod.size, Image.LANCZOS)
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
production build; you are not told which.

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
