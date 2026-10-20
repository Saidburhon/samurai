"""GeologicaSign: a static instance of Geologica at wght 280 and SHRP 100 for the words reflected in the steel
(Canvas 2D cannot set the SHRP axis). Usage: python3 sign-instance.py <Geologica.ttf> <out.woff2> <text>
(scripts/fonts.mjs runs the same job through jobs.py, with the .words of all three pages.)"""
import sys
from jobs import do_sign

if __name__ == '__main__':
    print(do_sign({'src': sys.argv[1], 'out': sys.argv[2], 'text': sys.argv[3], 'location': {'wght': 280, 'SHRP': 100, 'CRSV': 0, 'slnt': 0}}))
