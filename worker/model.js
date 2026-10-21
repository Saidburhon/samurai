// The catalogue model, built once per isolate from the JSON files the Worker bundles.
import cat from '../content/solutions.json' with { type: 'json' };
import extra from '../content/solutions-extra.json' with { type: 'json' };
import pricing from '../content/pricing.json' with { type: 'json' };
import { normalise } from '../src/shared/catalogue.js';

export const MODEL = normalise(cat, extra, pricing);
