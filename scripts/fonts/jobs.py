"""Font jobs for scripts/fonts.mjs (fontTools). Usage: python3 jobs.py <jobs.json>  -> prints a JSON result list.

Job kinds:
  subset   {src, out, text, limits?}            instance (pin or limit axes), then subset to `text`, woff2
  qokina   {src, out, family, limits?}           U+02BB mapped to the family's own quoteleft glyph, variations kept
  sign     {src, out, text, location}            a static instance (e.g. wght 280, SHRP 100), subset to `text`
  metrics  {src, fallback, location, text}       size-adjust / ascent / descent overrides for a metric-matched fallback
"""
import json, sys, io
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset as fsub

_cache = {}

def load(src, limits=None):
    key = (src, json.dumps(limits, sort_keys=True))
    if key not in _cache:
        f = TTFont(src)
        if limits and 'fvar' in f:
            lim = {k: (tuple(v) if isinstance(v, list) else v) for k, v in limits.items()}
            f = instancer.instantiateVariableFont(f, lim, updateFontNames=False)
        buf = io.BytesIO(); f.save(buf); _cache[key] = buf.getvalue()
    return TTFont(io.BytesIO(_cache[key]))

def opts():
    o = fsub.Options()
    o.flavor = 'woff2'
    o.layout_features = ['*']
    o.name_IDs = ['*']
    o.name_languages = ['*']
    o.notdef_outline = True
    o.hinting = False
    o.desubroutinize = True
    o.drop_tables += ['DSIG']
    return o

def rename(font, family):
    for rec in font['name'].names:
        if rec.nameID in (1, 4, 16, 21):
            rec.string = family
        elif rec.nameID == 6:
            rec.string = family.replace(' ', '')

def do_subset(j):
    f = load(j['src'], j.get('limits'))
    s = fsub.Subsetter(opts())
    s.populate(text=j['text'])
    s.subset(f)
    f.flavor = 'woff2'
    f.save(j['out'])
    return {'out': j['out'], 'glyphs': len(f.getGlyphOrder())}

def do_qokina(j):
    f = load(j['src'], j.get('limits'))
    cmap = f.getBestCmap()
    gname = cmap.get(0x2018)
    if not gname:
        raise SystemExit('no quoteleft in ' + j['src'])
    s = fsub.Subsetter(opts())
    s.populate(glyphs=[gname])
    s.subset(f)
    for t in f['cmap'].tables:
        t.cmap = {0x02BB: gname}
    rename(f, j['family'])
    f.flavor = 'woff2'
    f.save(j['out'])
    return {'out': j['out'], 'glyph': gname, 'axes': [a.axisTag for a in f['fvar'].axes] if 'fvar' in f else []}

def do_sign(j):
    f = TTFont(j['src'])
    f = instancer.instantiateVariableFont(f, j['location'], updateFontNames=False)
    s = fsub.Subsetter(opts())
    s.populate(text=j['text'])
    s.subset(f)
    rename(f, j.get('family', 'GeologicaSign'))
    f.flavor = 'woff2'
    f.save(j['out'])
    return {'out': j['out'], 'glyphs': len(f.getGlyphOrder())}

def avg_width(font, text):
    cmap = font.getBestCmap(); hmtx = font['hmtx']; upm = font['head'].unitsPerEm
    tot = n = 0
    for ch in text:
        g = cmap.get(ord(ch))
        if g is None:
            continue
        tot += hmtx[g][0]; n += 1
    return tot / max(1, n) / upm

def do_metrics(j):
    f = TTFont(j['src'])
    if 'fvar' in f:
        f = instancer.instantiateVariableFont(f, j['location'], updateFontNames=False)
    fb = TTFont(j['fallback'])
    upm = f['head'].unitsPerEm
    hh = f['hhea']
    adj = avg_width(f, j['text']) / avg_width(fb, j['text'])
    return {
        'sizeAdjust': round(adj * 100, 2),
        'ascent': round(hh.ascent / upm / adj * 100, 2),
        'descent': round(abs(hh.descent) / upm / adj * 100, 2),
        'lineGap': round(hh.lineGap / upm / adj * 100, 2),
    }

KINDS = {'subset': do_subset, 'qokina': do_qokina, 'sign': do_sign, 'metrics': do_metrics}

if __name__ == '__main__':
    jobs = json.load(open(sys.argv[1], encoding='utf-8'))
    print(json.dumps([KINDS[j['kind']](j) for j in jobs]))
