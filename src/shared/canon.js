// Canonical JSON for signing: object keys sorted at every depth, no whitespace, numbers as JSON writes them.
// The Worker signs canon(payload) and verifies canon(payload) from a share link, so key order never matters.
export function canon(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v ?? null);
  if (Array.isArray(v)) return `[${v.map(canon).join(',')}]`;
  return `{${Object.keys(v).filter((k) => v[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${canon(v[k])}`).join(',')}}`;
}
