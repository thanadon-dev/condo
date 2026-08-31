import { SITE_URL, absolute } from "./site";
import type { SiteInfo } from "./site";
import type { Property, Article, Deal, Area } from "./queries";

/** ใส่ JSON-LD ลงหน้า: <script type="application/ld+json"> */
export function ld(data: unknown): string {
  return JSON.stringify(data);
}

export function breadcrumb(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absolute(it.path),
    })),
  };
}

export function organization(SITE: SiteInfo): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${SITE_URL}/#organization`,
    name: SITE.name,
    url: SITE_URL,
    telephone: SITE.phone,
    email: SITE.email,
    image: absolute("/media/hero-mock.webp"),
    logo: absolute("/media/logo.png"),
    priceRange: "฿฿",
    areaServed: {
      "@type": "City",
      name: "กรุงเทพมหานคร",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address,
      addressLocality: "กรุงเทพมหานคร",
      addressCountry: "TH",
    },
    employee: {
      "@type": "Person",
      name: SITE.agent.name,
      jobTitle: SITE.agent.role,
    },
  };
}

export function website(SITE: SiteInfo): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE.name,
    inLanguage: "th-TH",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/properties?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** รายการทรัพย์ -> ItemList (ช่วยให้ Google เข้าใจว่าหน้านี้คือลิสต์) */
export function itemList(
  items: Property[],
  pathOf: (p: Property) => string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absolute(pathOf(p)),
      name: p.title,
    })),
  };
}

export function faqPage(
  qa: { q: string; a: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };
}

export function articleLd(
  a: Article,
  SITE: SiteInfo,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.lead,
    datePublished: a.published_on,
    dateModified: a.published_on,
    inLanguage: "th-TH",
    articleSection: a.tag,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absolute(`/journal/${a.slug}`),
    },
    author: { "@type": "Person", name: SITE.agent.name },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function dealLd(d: Deal, SITE: SiteInfo): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: d.title,
    datePublished: d.closed_on,
    inLanguage: "th-TH",
    articleSection: d.cat,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absolute(`/deal/${d.slug}`),
    },
    author: { "@type": "Person", name: SITE.agent.name },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function areaLd(
  a: Area,
  count: number,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: a.name,
    url: absolute(`/area/${a.slug}`),
    description: `รวมคอนโดและบ้านเช่าในทำเล${a.name} กรุงเทพฯ ทั้งหมด ${count} รายการ`,
    address: {
      "@type": "PostalAddress",
      addressLocality: a.name,
      addressRegion: "กรุงเทพมหานคร",
      addressCountry: "TH",
    },
  };
}
