// The one detail of a poster, in the label style (kanji 26 px, gloss 15 px, a hairline leader): the tip at B1 (切先),
// the polishing stone at B12 (内曇). Labels appear instantly, inside the hold window only (§5.6: no fades), and are
// placed from the sword's projection, so they sit on the steel at any viewport.
const html = (at, end, body) => `<svg class="lead" width="100%" height="100%"><path d="M${at[0].toFixed(1)} ${at[1].toFixed(1)}L${end[0].toFixed(1)} ${end[1].toFixed(1)}"/><circle cx="${at[0].toFixed(1)}" cy="${at[1].toFixed(1)}" r="1.8"/></svg><span class="lt" style="left:${end[0].toFixed(1)}px;top:${end[1].toFixed(1)}px">${body}</span>`;

export class Labels {
  constructor(stage) { this.st = stage; this.el = document.getElementById('labels'); this.key = ''; }
  update(d, layout) {
    const name = d && d.atHold ? d.hold : null;
    const key = name ? `${name}|${layout}|${this.st.w}x${this.st.h}` : '';
    if (key === this.key) return;
    this.key = key;
    if (!this.el) return;
    this.el.innerHTML = '';
    if (name === 'mei.promise') {
      const tpl = document.querySelector('#strings [data-k="p.kissaki"]');
      if (!tpl) return;
      const at = this.st.project(this.st.point({ s: 0.995, zf: 0.1 })), dir = layout === 'land' ? [-0.35, -0.94] : [-0.3, -0.95];
      this.add(html(at, [at[0] + dir[0] * 40, at[1] + dir[1] * 40], tpl.innerHTML));
    } else if (name === 'togi.front') {
      const src = document.querySelector('.s-togi .stone');
      if (!src) return;
      const at = this.st.project(this.st.point({ s: 0.72, zf: 0.0 }));
      this.add(html([at[0], at[1] - 6], [at[0], at[1] - 44], src.innerHTML).replace(/<circle[^>]*\/>/, ''));
    }
  }
  add(inner) { const d = document.createElement('div'); d.className = 'plabel'; d.innerHTML = inner; this.el.appendChild(d); }
}
