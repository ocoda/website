import { i18nConfig } from '~/modules/i18n/config';

export const loader = () => {
  const lastUpdated = new Date('2024-11-12T15:24:00').toISOString();

  const base = 'https://www.ocoda.be';
  const urls = ['/', 'dries', 'privacy-policy', 'terms-and-conditions'];
  const languages = new Set([i18nConfig.fallbackLng, ...i18nConfig.supportedLngs]);

  const content = `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
      <url>
          <loc>https://www.ocoda.be/en/</loc>
          <xhtml:link rel="alternate" hreflang="nl" href="https://www.ocoda.be/nl/"/>
          <xhtml:link rel="alternate" hreflang="en" href="https://www.ocoda.be/en/"/>
          <lastmod>${lastUpdated}</lastmod>
      </url>
      <url>
          <loc>https://www.ocoda.be/en/dries/</loc>
          <xhtml:link rel="alternate" hreflang="nl" href="https://www.ocoda.be/nl/dries/"/>
          <xhtml:link rel="alternate" hreflang="en" href="https://www.ocoda.be/en/dries/"/>
          <lastmod>${lastUpdated}</lastmod>
      </url>
      <url>
        <loc>https://www.ocoda.be/en/privacy-policy/</loc>
        <xhtml:link rel="alternate" hreflang="nl" href="https://www.ocoda.be/nl/privacy-policy/"/>
        <xhtml:link rel="alternate" hreflang="en" href="https://www.ocoda.be/en/privacy-policy/"/>
        <lastmod>${lastUpdated}</lastmod>
      </url>
      <url>
        <loc>https://www.ocoda.be/en/terms-and-conditions/</loc>
        <xhtml:link rel="alternate" hreflang="nl" href="https://www.ocoda.be/nl/terms-and-conditions/"/>
        <xhtml:link rel="alternate" hreflang="en" href="https://www.ocoda.be/en/terms-and-conditions/"/>
        <lastmod>${lastUpdated}</lastmod>
      </url>
    </urlset>
  `;

  return new Response(content.toString(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8',
    },
  });
};
