// JSON-LD: one @graph per page (SEO-GEO-DECISIONS, "Crawl, index, structured data").
//   Organization  https://qilich.com/#organization   the same node on every page; only `description` is translated
//   WebSite       https://qilich.com/#website        the same node on every page
//   WebPage       <url>#webpage                      or AboutPage / ContactPage, with inLanguage and isPartOf
//   BreadcrumbList <url>#breadcrumb                  every page below a home page
//   Person        https://qilich.com/en/about/#person-<slug>   on the about and press pages, for the people listed in
//                 content/site.json, each worksFor the Organization (the Organization itself names nobody, so its node
//                 stays the same on every page and every reference resolves on the page that carries it)
// Facts come from content/site.json and nothing else: legalName, foundingDate, sameAs, people, the Japanese entity
// and the street address appear only when they are filled in. No ratings, no reviews, no keywords.
import { SITE, LANGS, site, has, abs } from '../site.mjs';

export const ORG_ID = `${SITE}/#organization`;
export const WEBSITE_ID = `${SITE}/#website`;
export const LOGO_ID = `${SITE}/#logo`;
const slugify = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-');
export const personId = (p) => `${SITE}/en/about/#person-${p.slug || slugify(p.name)}`;

function postal(a) {
  const o = { '@type': 'PostalAddress' };
  if (has(a.streetAddress)) o.streetAddress = a.streetAddress;
  if (has(a.locality)) o.addressLocality = a.locality;
  if (has(a.postalCode)) o.postalCode = a.postalCode;
  o.addressCountry = a.country;
  return o;
}

// key order is fixed, so the node is byte-identical on every page apart from the description
export function organization(lang) {
  const a = site.address, j = site.japan;
  const addresses = [postal({ streetAddress: a.streetAddress, locality: a.locality.en, postalCode: a.postalCode, country: a.country })];
  if (has(j.legalName) && has(j.locality)) addresses.push(postal({ streetAddress: j.streetAddress, locality: j.locality, postalCode: j.postalCode, country: 'JP' }));
  const point = {
    '@type': 'ContactPoint', contactType: 'sales', telephone: site.telephone, email: site.email,
    availableLanguage: site.contact.availableLanguage,
  };
  if (has(site.contact.hours)) point.hoursAvailable = site.contact.hours;
  const o = { '@type': 'Organization', '@id': ORG_ID, name: site.brand };
  if (has(site.legalName)) o.legalName = site.legalName;
  if (has(site.brandKana)) o.alternateName = site.brandKana;
  Object.assign(o, {
    url: `${SITE}/`,
    logo: { '@type': 'ImageObject', '@id': LOGO_ID, url: `${SITE}/assets/img/logo-512.png`, contentUrl: `${SITE}/assets/img/logo-512.png`, width: 512, height: 512, caption: site.brand },
    image: { '@id': LOGO_ID },
    description: site.description[lang],
    email: site.email,
    telephone: site.telephone,
  });
  if (has(site.foundingDate)) o.foundingDate = String(site.foundingDate);
  o.address = addresses.length === 1 ? addresses[0] : addresses;
  // named Japanese-speaking contacts (content/site.json japan.contacts: { name, role, email, telephone, languages }),
  // one ContactPoint each, only when the owner lists them
  const jc = (j.contacts || []).filter((c) => has(c?.name));
  o.contactPoint = jc.length ? [point, ...jc.map((c) => ({ '@type': 'ContactPoint', contactType: 'sales', name: c.name, ...(has(c.email) ? { email: c.email } : {}), ...(has(c.telephone) ? { telephone: c.telephone } : {}), availableLanguage: has(c.languages) ? c.languages : ['ja'], areaServed: 'JP' }))] : point;
  if (has(site.japan.legalName)) o.subOrganization = { '@type': 'Organization', name: site.japan.legalName, address: addresses[1] || undefined, telephone: has(j.telephone) ? j.telephone : undefined };
  if (has(site.sameAs)) o.sameAs = site.sameAs;
  return o;
}

export function website() {
  return { '@type': 'WebSite', '@id': WEBSITE_ID, url: `${SITE}/`, name: site.brand, inLanguage: LANGS, publisher: { '@id': ORG_ID } };
}

export function person(p, lang) {
  const o = { '@type': 'Person', '@id': personId(p), name: p.name };
  if (has(p.role)) o.jobTitle = p.role[lang] || p.role.en;
  o.worksFor = { '@id': ORG_ID };
  if (has(p.photo)) o.image = abs(p.photo);
  if (has(p.languages)) o.knowsLanguage = p.languages;
  if (has(p.sameAs)) o.sameAs = p.sameAs;
  return o;
}

// page: { lang, path, type, title, description, crumbs: [{ name, path }] (home first; empty on a home page), about }
export function graph(page) {
  const url = abs(page.path);
  const nodes = [organization(page.lang), website()];
  const wp = {
    '@type': page.type || 'WebPage', '@id': `${url}#webpage`, url, name: page.title, description: page.description,
    inLanguage: page.lang, isPartOf: { '@id': WEBSITE_ID },
  };
  if (page.about !== false) wp.about = { '@id': ORG_ID };
  if (page.mainEntity) wp.mainEntity = { '@id': page.mainEntity };
  if (page.crumbs?.length > 1) wp.breadcrumb = { '@id': `${url}#breadcrumb` };
  nodes.push(wp);
  if (page.crumbs?.length > 1) {
    nodes.push({
      '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
      itemListElement: page.crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
    });
  }
  if (page.people && has(site.people)) for (const p of site.people) nodes.push(person(p, page.lang));
  for (const n of page.extra || []) nodes.push(n);
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export const ldScript = (g) => `<script type="application/ld+json">${JSON.stringify(g).replace(/</g, '\\u003c')}</script>`;
