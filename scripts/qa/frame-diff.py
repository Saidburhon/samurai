#!/usr/bin/env python3
"""The frame measures of SPEC §3.9, for the G3/G4 probes.

  frame-diff.py pairs <dir>           mid vs settled: d-step-NN-mid.png against d-step-NN.png
  frame-diff.py neighbours <dir> [glob] neighbouring settled frames (d-step-NN.png, or files matching glob)
  frame-diff.py compare <a.png> <b.png> [band]
                                      equality: share of full-size pixels that differ by more than 24 grey levels;
                                      band=top80 compares only the top 80 CSS px (60 px at DPR .75)

The thumbnail measure: both frames as 480 x 300 greyscale; the share of pixels that differ by more than 24 levels.
Neighbours must differ by >= 18 %, a mid frame from its settled frame by >= 10 %. Prints JSON."""
import sys, os, glob, json
from PIL import Image, ImageChops

def thumb(p, size=(480, 300)):
    return Image.open(p).convert('L').resize(size, Image.BILINEAR)

def share(a, b, thr=24):
    d = ImageChops.difference(a, b)
    h = d.histogram()
    n = sum(h)
    return sum(h[thr + 1:]) / n if n else 0.0

def main():
    mode = sys.argv[1]
    if mode == 'pairs':
        d = sys.argv[2]
        out = {}
        for mid in sorted(glob.glob(os.path.join(d, 'd-step-*-mid.png'))):
            st = mid.replace('-mid.png', '.png')
            if os.path.exists(st):
                out[os.path.basename(st)[:-4]] = round(share(thumb(mid), thumb(st)), 4)
        low = {k: v for k, v in out.items() if v < 0.10}
        print(json.dumps({'measure': out, 'low': low}))
    elif mode == 'neighbours':
        d = sys.argv[2]
        pat = sys.argv[3] if len(sys.argv) > 3 else 'd-step-[0-9][0-9].png'
        fs = sorted(glob.glob(os.path.join(d, pat)))
        out = {}
        for a, b in zip(fs, fs[1:]):
            out[f'{os.path.basename(a)[:-4]}>{os.path.basename(b)[:-4]}'] = round(share(thumb(a), thumb(b)), 4)
        low = {k: v for k, v in out.items() if v < 0.18}
        print(json.dumps({'measure': out, 'low': low}))
    elif mode == 'stamp':
        # the beat a frame shows (?stamp: the film paints it in the bottom-left corner)
        out = {}
        for f in sys.argv[2:]:
            im = Image.open(f).convert('RGB')
            r, g, b = im.getpixel((2, im.size[1] - 2))
            out[os.path.basename(f)] = round(round(r / 10) + g / 250, 3) if abs(b - 77) < 6 else None
        print(json.dumps(out))
    elif mode == 'compare':
        a, b = Image.open(sys.argv[2]).convert('L'), Image.open(sys.argv[3]).convert('L')
        if len(sys.argv) > 4 and sys.argv[4] == 'top80':
            h = round(80 * a.size[0] / 1440) if a.size[0] > a.size[1] else round(80 * a.size[0] / 390)
            a, b = a.crop((0, 0, a.size[0], h)), b.crop((0, 0, b.size[0], h))
        if a.size != b.size:
            b = b.resize(a.size)
        print(json.dumps({'share': round(share(a, b), 5)}))

if __name__ == '__main__':
    main()
