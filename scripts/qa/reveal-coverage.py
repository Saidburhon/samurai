"""The intro's frames from scripts/qa/boot-probe.cjs (G1 r2, §0.1 frame 02 and G2's '3 s = 60-85 % steel'):
  coverage  the share of the sword's axis, kashira (K) to tip (T), that the rendered steel covers in the 3 s frame,
            read against the same run's 1 s frame (the drawing alone, in the same place; the blade bends off the
            K-T chord, so each station searches across it)
  steel     whether the steel is on screen in the later frames (6.5, 10, 16 s): the share of dark pixels in a band
            around the chord (the hero's dark ji and shinogi-ji ~4-5 %, the drawing alone under 1 %; threshold 2 %)
Usage: python3 scripts/qa/reveal-coverage.py <boot-probe dir> [land|port]"""
import glob, json, os, sys
import numpy as np
from PIL import Image

d = sys.argv[1]; lay = sys.argv[2] if len(sys.argv) > 2 else 'land'
K, T = ((0.072, 0.698), (0.921, 0.258)) if lay == 'land' else ((0.626, 0.955), (0.856, 0.123))
runs = sorted({os.path.basename(f).split('-')[0] for f in glob.glob(os.path.join(d, 'r*-*.png'))}, key=lambda r: int(r[1:]))


def axis(H, W):
    k = np.array([K[0] * W, K[1] * H]); t = np.array([T[0] * W, T[1] * H]); L = np.linalg.norm(t - k)
    u = (t - k) / L
    return k, t, L, u, np.array([-u[1], u[0]])


def coverage(f3, f1):
    a = np.asarray(Image.open(f3).convert('RGB')).astype(int); b = np.asarray(Image.open(f1).convert('RGB')).astype(int)
    H, W = a.shape[:2]; k, t, L, u, n = axis(H, W)
    cov = []
    for j in range(401):
        p = k + (t - k) * j / 400; hit = 0
        for o in range(-int(0.06 * L), int(0.06 * L) + 1, 2):
            q = p + n * o; x, y = int(round(q[0])), int(round(q[1]))
            if 0 <= x < W and 0 <= y < H and np.abs(a[y, x] - b[y, x]).max() > 60: hit += 1
        cov.append(hit >= 3)
    cov = np.array(cov); front = 0
    for j in range(12, 401):
        if cov[j - 12:j].mean() >= 0.75: front = j
    return front / 400


def steel(f):
    a = np.asarray(Image.open(f).convert('L')).astype(int); H, W = a.shape; k, t, L, u, n = axis(H, W)
    ys, xs = np.mgrid[0:H, 0:W]; P = np.stack([xs - k[0], ys - k[1]], -1); al = P @ u; ac = P @ n
    m = (al > 0.25 * L) & (al < L) & (np.abs(ac) < 0.06 * L)
    return float((a[m] < 70).mean())


out = {}
for r in runs:
    o = {}
    f1, f3 = os.path.join(d, f'{r}-1000.png'), os.path.join(d, f'{r}-3000.png')
    if os.path.exists(f1) and os.path.exists(f3): o['coverage3s'] = round(coverage(f3, f1), 3)
    for ms in ('6500', '8000', '10000', '16000'):
        f = os.path.join(d, f'{r}-{ms}.png')
        if os.path.exists(f): o['steel' + ms] = steel(f) > 0.02
    out[r] = o; print(r, o)
cv = sorted(o['coverage3s'] for o in out.values() if 'coverage3s' in o)
print('3 s coverage', cv, 'in 60-85 %:', sum(0.6 <= c <= 0.85 for c in cv), '/', len(cv))
for ms in ('6500', '8000', '10000', '16000'):
    v = [o['steel' + ms] for o in out.values() if 'steel' + ms in o]
    if v: print(f'steel at {int(ms) / 1000} s: {sum(v)} / {len(v)}')
json.dump(out, open(os.path.join(d, 'reveal-coverage.json'), 'w'), indent=1)
