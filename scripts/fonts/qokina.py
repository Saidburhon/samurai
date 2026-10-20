"""QOkina: Geologica, Martian Mono and Zen Old Mincho lack U+02BB (the Uzbek okina). This makes a tiny font that maps
U+02BB to the family's own quoteleft glyph and keeps fvar/gvar, so the okina follows wght, SHRP and wdth.
Usage: python3 qokina.py <variable.ttf> <out.woff2> <Family> ['{"CRSV": 0, "slnt": 0}']
(scripts/fonts.mjs runs the same job through jobs.py.)"""
import json, sys
from jobs import do_qokina

if __name__ == '__main__':
    lim = json.loads(sys.argv[4]) if len(sys.argv) > 4 else None
    print(do_qokina({'src': sys.argv[1], 'out': sys.argv[2], 'family': sys.argv[3], 'limits': lim}))
