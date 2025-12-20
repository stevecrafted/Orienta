import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Langues supportées
export const locales = ['en', 'fr', 'mg'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  mg: 'Malagasy'
};

export default getRequestConfig(async ({ locale }) => {
  // 🔒 Forcer une locale valide
  const resolvedLocale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  // Si la locale est invalide → 404
  if (!locales.includes(resolvedLocale)) {
    notFound();
  }

  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default
  };
});
