// The blog's Markdown, converted at build (SOLUTIONS-SPEC §5.1): a small, strict subset, so every post prints in the
// same typographic system and nothing unexpected reaches the page.
//   blocks   ## h2 and ### h3 (a # h1 or #### fails: the page owns the h1), paragraphs, - / * and 1. lists (nested by
//            indentation), GFM tables (alignment row honoured), > blockquotes (nested Markdown inside), ``` fenced
//            text (printed as a ruled form, never highlighted code), and {{shortcode}} lines
//   inline   **strong**, *em* / _em_, `code`, [text](url); everything else is text and is escaped
// Raw HTML in the Markdown fails the build (an error names the file and line), as does an unknown block form.
// convert(md, { file, shortcode(name, args, ctx) → HTML, link(href) → href }) → { html, headings: [{ level, id, text }], words }

const escHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export class MdError extends Error {}

// ---- inline ----------------------------------------------------------------------------------------------------
function inline(src, opt, where) {
  if (/<\/?[a-zA-Z][^>]*>/.test(src.replace(/`[^`]*`/g, ''))) throw new MdError(`${where}: raw HTML is not allowed in a post («${src.slice(0, 60)}»)`);
  let out = '';
  let i = 0;
  const s = src;
  while (i < s.length) {
    const c = s[i];
    if (c === '\\' && i + 1 < s.length && /[\\`*_[\]()#+\-.!>|{}]/.test(s[i + 1])) { out += escHtml(s[i + 1]); i += 2; continue; }
    if (s.startsWith('{{', i)) {
      const j = s.indexOf('}}', i + 2);
      const m = j > 0 && /^\s*([\w-]+)(?::([^}]*))?\s*$/.exec(s.slice(i + 2, j));
      if (!m) throw new MdError(`${where}: a broken shortcode («${s.slice(i, i + 40)}»)`);
      if (!opt.shortcode) throw new MdError(`${where}: shortcodes are not available here`);
      out += opt.shortcode(m[1], (m[2] || '').trim(), { where, inline: true });
      i = j + 2; continue;
    }
    if (c === '`') {
      const j = s.indexOf('`', i + 1);
      if (j > i) { out += `<code>${escHtml(s.slice(i + 1, j))}</code>`; i = j + 1; continue; }
    }
    if (c === '[') {
      const m = /^\[((?:[^\]\\]|\\.)+)\]\(([^)\s]+)\)/.exec(s.slice(i));
      if (m) {
        const href = opt.link ? opt.link(m[2], where) : m[2];
        const ext = /^https?:\/\//.test(href);
        out += `<a href="${escHtml(href)}"${ext ? ' rel="noopener"' : ''}>${inline(m[1], opt, where)}</a>`;
        i += m[0].length; continue;
      }
    }
    if (s.startsWith('**', i)) {
      const j = s.indexOf('**', i + 2);
      if (j > i + 2) { out += `<strong>${inline(s.slice(i + 2, j), opt, where)}</strong>`; i = j + 2; continue; }
    }
    if ((c === '*' || c === '_') && s[i + 1] && !/\s/.test(s[i + 1])) {
      // _ only at a word boundary (snake_case stays text)
      const okStart = c === '*' || i === 0 || /[\s(«"“]/.test(s[i - 1]);
      let j = s.indexOf(c, i + 1);
      while (j > 0 && c === '*' && s[j + 1] === '*') j = s.indexOf(c, j + 2);
      const okEnd = j > i + 1 && !/\s/.test(s[j - 1]) && (c === '*' || j === s.length - 1 || /[\s).,;:!?»"”]/.test(s[j + 1]));
      if (okStart && okEnd) { out += `<em>${inline(s.slice(i + 1, j), opt, where)}</em>`; i = j + 1; continue; }
    }
    out += escHtml(c);
    i++;
  }
  return out;
}

// ---- blocks ----------------------------------------------------------------------------------------------------
const LIST = /^(\s*)([-*]|\d+[.)])\s+(.*)$/;
const indentOf = (l) => l.match(/^\s*/)[0].replace(/\t/g, '    ').length;

function slugId(text, used) {
  let base = text.toLowerCase().normalize('NFKD').replace(/[ʻʼ'’‘`]/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 's';
  let id = base, n = 2;
  while (used.has(id)) id = `${base}-${n++}`;
  used.add(id);
  return id;
}

function cells(row) {
  let r = row.trim();
  if (r.startsWith('|')) r = r.slice(1);
  if (r.endsWith('|') && !r.endsWith('\\|')) r = r.slice(0, -1);
  return r.split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));
}

function blocks(lines, opt, ctx, base) {
  const out = [];
  let i = 0;
  const where = (k) => `${opt.file}:${base + k + 1}`;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    // fenced text: a form or a template the reader copies; printed ruled, never as code
    if (/^```/.test(line.trim())) {
      const body = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) body.push(lines[i++]);
      if (i >= lines.length) throw new MdError(`${where(i - 1)}: an unclosed \`\`\` block`);
      i++;
      out.push(`<pre class="form"><code>${escHtml(body.join('\n').replace(/\s+$/, ''))}</code></pre>`);
      continue;
    }
    const h = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
    if (h) {
      const level = h[1].length;
      if (level < 2 || level > 3) throw new MdError(`${where(i)}: only ## and ### headings are allowed (found ${h[1]})`);
      const text = h[2];
      const id = slugId(text.replace(/[*_`]/g, ''), ctx.ids);
      ctx.headings.push({ level, id, text: text.replace(/[*_`]/g, '') });
      out.push(`<h${level} id="${id}">${inline(text, opt, where(i))}</h${level}>`);
      i++; continue;
    }
    // a shortcode on its own line becomes a block
    const sc = /^\{\{\s*([\w-]+)(?::([^}]*))?\s*\}\}$/.exec(line.trim());
    if (sc) {
      if (!opt.shortcode) throw new MdError(`${where(i)}: shortcodes are not available here`);
      out.push(opt.shortcode(sc[1], (sc[2] || '').trim(), { where: where(i) }));
      ctx.shortcodes.push(sc[1]);
      i++; continue;
    }
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { out.push('<hr>'); i++; continue; }
    if (/^\s*>/.test(line)) {
      const body = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) body.push(lines[i++].replace(/^\s*>\s?/, ''));
      out.push(`<blockquote>${blocks(body, opt, ctx, base + i - body.length).join('')}</blockquote>`);
      continue;
    }
    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(lines[i + 1])) {
      const head = cells(line);
      const align = cells(lines[i + 1]).map((c) => (/^:-+:$/.test(c) ? 'center' : /-+:$/.test(c) ? 'right' : ''));
      i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(cells(lines[i++]));
      const al = (k) => (align[k] ? ` class="${align[k] === 'right' ? 'r' : 'c'}"` : '');
      const w = where(i - rows.length - 2);
      // the first column names the row: a row header, so a phone reader keeps the label with its values
      const th = head.map((c, k) => `<th scope="col"${al(k)}>${inline(c, opt, w)}</th>`).join('');
      const tb = rows.map((r) => `<tr>${head.map((_, k) => (k === 0 ? `<th scope="row">${inline(r[k] || '', opt, w)}</th>` : `<td${al(k)}>${inline(r[k] || '', opt, w)}</td>`)).join('')}</tr>`).join('');
      // the scrollable region's name: the page's word for a table (header cells may hold another language's words)
      // a table of three or more columns keeps its width on a phone and scrolls (with a cue); two columns wrap in place
      const wide = head.length > 2;
      out.push(`<div class="tbl${wide ? ' wide' : ''}" role="region" aria-label="${escHtml(opt.tableLabel || head.filter(Boolean).join(' · ').replace(/[*_`]/g, ''))}" tabindex="0"${wide && opt.tableCue ? ` data-cue="${escHtml(opt.tableCue)}"` : ''}><table><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table></div>`);
      continue;
    }
    if (LIST.test(line)) {
      const [html, next] = list(lines, i, opt, ctx, base);
      out.push(html);
      i = next; continue;
    }
    // a paragraph: consecutive lines that start no other block
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|```|\s*>|\s*\|)/.test(lines[i]) && !LIST.test(lines[i]) && !/^\{\{.*\}\}$/.test(lines[i].trim())) para.push(lines[i++].trim());
    if (!para.length) throw new MdError(`${where(i)}: a line the blog cannot print («${line.slice(0, 60)}»)`);
    out.push(`<p>${inline(para.join(' '), opt, where(i - 1))}</p>`);
  }
  return out;
}

function list(lines, start, opt, ctx, base) {
  const first = LIST.exec(lines[start]);
  const ind = indentOf(lines[start]);
  const ordered = /\d/.test(first[2]);
  const items = [];
  let i = start;
  while (i < lines.length) {
    const m = LIST.exec(lines[i]);
    if (!m || indentOf(lines[i]) !== ind || /\d/.test(m[2]) !== ordered) break;
    const body = [m[3]];
    i++;
    // continuation lines and nested lists (indented deeper), blank lines inside an item
    while (i < lines.length) {
      const l = lines[i];
      if (!l.trim()) {
        const nx = lines.slice(i + 1).find((x) => x.trim());
        if (nx && indentOf(nx) > ind) { body.push(''); i++; continue; }
        break;
      }
      if (indentOf(l) > ind) { body.push(l.slice(Math.min(indentOf(l), ind + (ordered ? 3 : 2)))); i++; continue; }
      if (!LIST.test(l) && !/^(#{1,6}\s|```|\s*>|\s*\|)/.test(l)) { body.push(l.trim()); i++; continue; }
      break;
    }
    // the item's own text, then its nested blocks
    const sub = [];
    let k = 0;
    const text = [];
    while (k < body.length && body[k].trim() && !LIST.test(body[k])) text.push(body[k++].trim());
    while (k < body.length) sub.push(body[k++]);
    const nested = sub.some((x) => x.trim()) ? blocks(sub, opt, ctx, base + i).join('') : '';
    items.push(`<li>${inline(text.join(' '), opt, `${opt.file}:${base + i}`)}${nested}</li>`);
    while (i < lines.length && !lines[i].trim()) {
      const nx = lines.slice(i + 1).find((x) => x.trim());
      if (nx && LIST.test(nx) && indentOf(nx) === ind) i++; else break;
    }
  }
  const startAt = ordered && parseInt(first[2], 10) !== 1 ? ` start="${parseInt(first[2], 10)}"` : '';
  return [ordered ? `<ol${startAt}>${items.join('')}</ol>` : `<ul>${items.join('')}</ul>`, i];
}

// ---- front matter ----------------------------------------------------------------------------------------------
// YAML subset: key: value, "quoted", [a, b, c] lists, numbers, true/false
export function frontMatter(text, file) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!m) throw new MdError(`${file}: no front matter`);
  const data = {};
  for (const raw of m[1].split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const kv = /^([\w-]+):\s*(.*)$/.exec(raw);
    if (!kv) throw new MdError(`${file}: front matter line «${raw}»`);
    let v = kv[2].trim();
    if (/^\[.*\]$/.test(v)) v = v.slice(1, -1).split(',').map((x) => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
    else if (/^".*"$/.test(v)) v = JSON.parse(v);
    else if (/^'.*'$/.test(v)) v = v.slice(1, -1);
    else if (/^-?\d+(\.\d+)?$/.test(v)) v = Number(v);
    else if (v === 'true' || v === 'false') v = v === 'true';
    data[kv[1]] = v;
  }
  return { data, body: text.slice(m[0].length), bodyLine: m[0].split('\n').length - 1 };
}

export function convert(md, opt = {}) {
  const ctx = { ids: new Set(), headings: [], shortcodes: [] };
  const lines = md.replace(/\r\n?/g, '\n').split('\n');
  const html = blocks(lines, { file: opt.file || 'post', ...opt }, ctx, opt.line || 0).join('\n');
  const text = md.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`|[\]()-]/g, ' ');
  const words = (text.match(/[\p{L}\p{N}][\p{L}\p{N}ʻʼ'’-]*/gu) || []).length;
  // Japanese has no spaces: count characters (about 500 a minute is a calm reading pace)
  const cjk = (text.match(/[぀-ヿ㐀-鿿]/g) || []).length;
  return { html, headings: ctx.headings, shortcodes: ctx.shortcodes, words, cjk };
}
