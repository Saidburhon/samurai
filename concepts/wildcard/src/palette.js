export const C = {
  silk: '#EFE6D2',
  silkShade: '#DCCFB5',
  ivory: '#F6F1E6',
  ai: '#18234A',
  aiDeep: '#0F1631',
  loom: '#120F17',
  atlas: '#D1145A',
  saffron: '#F2B11B',
  emerald: '#0A7F55',
  shu: '#E2421F',
  kiri: '#B98A57',
};

export const hex3 = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

// role values painted into the role map (R channel)
export const ROLE = { ground: '#000000', kasuri: '#808080', abr: '#ffffff' };
