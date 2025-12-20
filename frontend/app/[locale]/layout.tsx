import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n'; 

export const metadata: Metadata = {
  title: "Hirion",
  description: "Améliorez votre CV avec l'IA",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming locale is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  console.log('🌐 [locale] Layout rendering with locale:', locale);

  // Get messages for this specific locale
  const messages = await getMessages({ locale });
  
  console.log('📦 Messages loaded for', locale, ':', Object.keys(messages).length, 'keys');

  return (
    <NextIntlClientProvider messages={messages} locale={locale}> 
      {children}
    </NextIntlClientProvider>
  );
}