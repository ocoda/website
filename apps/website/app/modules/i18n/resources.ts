import type { Params } from '@remix-run/react';
import { en } from '../../resources/locales/en';
import { nl } from '../../resources/locales/nl';
import type { MetaDescriptor } from '@remix-run/node';

const defaultLanguage = 'en';
export const supportedLanguages = ['en', 'nl'];
export type Language = (typeof supportedLanguages)[number];

export type Resource = {
  common: typeof en.common;
  home: typeof en.home;
};

export const resources: Record<Language, Resource> = { en, nl };

export function getLngFromParams(params: Params<'lang'>): Language | undefined {
  if (supportedLanguages.includes(params.lang as Language)) {
    return params.lang as Language;
  }
}

export function getLngFromUrl(url: string): Language | undefined {
  const { pathname } = new URL(url);
  const lng = pathname.split('/')[1];
  if (supportedLanguages.includes(lng)) {
    return lng as Language;
  }
}

export function ensureLocalizedURL(url: string, language?: Language): string {
  let parts = url.replace(/^\/+|\/+$/g, '').split('/');

  if (language && !supportedLanguages.includes(language)) {
    throw new Error(`Invalid language: ${language}. Supported languages are: ${supportedLanguages.join(', ')}`);
  }

  if (supportedLanguages.includes(parts[0])) {
    if (language) {
      parts[0] = language;
    }
  } else {
    parts = [language || defaultLanguage, ...parts];
  }

  return `/${parts.join('/')}`;
}

export function getLocaleMetaTags(url: string): MetaDescriptor[] {
  return supportedLanguages.map((lng) => ({
    rel: 'alternate',
    hrefLang: lng,
    href: ensureLocalizedURL(url, lng),
  }));
}
