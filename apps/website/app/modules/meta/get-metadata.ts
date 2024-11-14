import type { MetaDescriptor } from '@remix-run/node';
import { ensureLocalizedURL, supportedLanguages } from '../i18n/resources';

declare global {
  interface Window {
    ENV: {
      BASE_URL: string;
    };
  }
}

export function getDefaultMetaTags(options?: { index?: boolean }): MetaDescriptor[] {
  return [
    { name: 'author', content: 'Ocoda BV' },
    { name: 'robots', content: options?.index === false ? 'noindex' : 'all' },
  ];
}

export interface PageMetadata {
  title: string;
  keywords: string[];
  description: string;
}
export function getPageMetaTags(page?: PageMetadata): MetaDescriptor[] {
  if (!page) return [];
  const tags: MetaDescriptor[] = [{ title: page.title }];

  page.keywords && tags.push({ name: 'keywords', content: page.keywords.join(',') });
  page.description && tags.push({ name: 'description', content: page.description });

  return tags;
}

export function getLocaleMetaTags(url: string): MetaDescriptor[] {
  const origin = typeof window === 'undefined' ? process.env.BASE_URL : window.ENV.BASE_URL;

  const languageTags = supportedLanguages.map((lng) => ({ hrefLang: lng, href: ensureLocalizedURL(url, lng, origin) }));
  return [
    { rel: 'canonical', href: languageTags[0].href },
    ...languageTags.map((params) => ({ rel: 'alternate', ...params })),
  ];
}
