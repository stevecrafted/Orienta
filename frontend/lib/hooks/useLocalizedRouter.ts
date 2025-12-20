"use client";

import { useRouter as useNextRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export function useLocalizedRouter() {
  const router = useNextRouter();
  const locale = useLocale();
  const pathname = usePathname();

  const push = (path: string) => {
    router.push(`/${locale}${path}`);
  };

  const replace = (path: string) => {
    router.replace(`/${locale}${path}`);
  };

  return {
    ...router,
    push,
    replace,
    locale,
    pathname
  };
}

export function getLocalizedPath(locale: string, path: string) {
  return `/${locale}${path}`;
}
