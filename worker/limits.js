// Rate limits (SOLUTIONS-SPEC §2.8.5): wrangler `ratelimits` bindings, counted per Cloudflare location (approximate).
//   RL_IP    5 SamurAI requests per 60 s per visitor (a refine counts; the stage-2 calls do not)
//   RL_ALL   60 per 60 s, all visitors together
//   RL_LEAD  3 leads per 60 s per visitor
//   RL_READ  30 signature checks and rate reads per 60 s per visitor (/api/samurai/verify, /api/rate)
// A missing binding never blocks (the spend guard in worker/spend.js still caps the day).

/** An IPv4 address as it is, an IPv6 address cut to its /64 (one household or phone holds a whole /64). */
export function visitorKey(ip) {
  if (!ip || !ip.includes(':')) return ip || 'local';
  if (ip.includes('.')) return ip.slice(ip.lastIndexOf(':') + 1);
  try {
    const [a, b = ''] = ip.toLowerCase().split('::');
    const h = a ? a.split(':') : [], t = b ? b.split(':') : [];
    const all = [...h, ...Array(8 - h.length - t.length).fill('0'), ...t];
    if (all.length !== 8 || !all.every((x) => /^[0-9a-f]{1,4}$/.test(x))) return ip;
    return `${all.slice(0, 4).map((x) => x.padStart(4, '0')).join(':')}::/64`;
  } catch { return ip; }
}

/** True when the request is over a limit. */
export async function over(binding, key) {
  if (typeof binding?.limit !== 'function') return false;
  try { const { success } = await binding.limit({ key }); return !success; } catch { return false; }
}
