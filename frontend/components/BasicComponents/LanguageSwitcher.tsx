"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/i18n'; 
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return;
    
    // Get the path without locale
    const segments = pathname.split('/').filter(Boolean);
    
    // Remove the first segment if it's a locale
    if (locales.includes(segments[0] as Locale)) {
      segments.shift();
    }
    
    // Build the new path
    const pathWithoutLocale = segments.length > 0 ? `/${segments.join('/')}` : '';
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    // Use startTransition with router.push instead of window.location
    startTransition(() => {
      router.push(newPath);
    });
  };
  
  return (
    <div className="language-switcher">
      <select
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        className="language-select"
        aria-label="Select language"
        disabled={isPending}
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc as Locale]}
          </option>
        ))}
      </select>
      <style jsx>{`
        .language-switcher {
          display: inline-block;
        }
        
        .language-select {
          padding: 8px 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background-color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          outline: none;
        }
        
        .language-select:hover {
          border-color: #4a90e2;
        }
        
        .language-select:focus {
          border-color: #4a90e2;
          box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        }
        
        .language-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}