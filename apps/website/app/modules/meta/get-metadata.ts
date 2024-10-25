import type { MetaDescriptor } from '@remix-run/node';
import { ensureLocalizedURL, supportedLanguages } from '~/modules/i18n/resources';

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
  return supportedLanguages.map((lng) => ({
    rel: 'alternate',
    hrefLang: lng,
    href: ensureLocalizedURL(url, lng),
  }));
}
