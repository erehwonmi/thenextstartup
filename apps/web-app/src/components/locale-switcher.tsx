'use client';

import * as React from 'react';

import { locales } from '@web-app/config';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ts/uikit';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@web-app/navigation';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const router = useRouter();

  const pathname = usePathname();

  function onSelectChange(nextLocale: string) {
    router.replace({ pathname }, { locale: nextLocale });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-xl">
          {t('locale', { locale })}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>{t('label')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={locale} onValueChange={onSelectChange}>
          {locales.map((cur) => (
            <DropdownMenuRadioItem value={cur} key={cur}>
              {t('locale', { locale: cur })}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
