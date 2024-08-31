'use client';
import { Card, CardDescription, CardHeader, CardTitle } from '@ts/uikit';
import {
  BookCopy,
  AppWindow,
  DatabaseZap,
  Cloudy,
  Boxes,
  SignpostBig,
  LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const TOTAL_CARDS = 6;

const CARD_ICON_MAP: Record<number, LucideIcon> = {
  0: Cloudy,
  1: Boxes,
  2: AppWindow,
  3: BookCopy,
  4: DatabaseZap,
  5: SignpostBig,
};

const Cards = () => {
  let cards = [];
  const t = useTranslations('Benefits');

  for (let x = 0; x < TOTAL_CARDS; x++) {
    const CardIcon = CARD_ICON_MAP[x];
    cards.push(
      <Card className="w-50" key={`Benefits${x + 1}`}>
        <CardHeader className="font-josefinSans">
          <CardTitle className="flex flex-col">
            <CardIcon />
            <label className="mt-4">{t.rich(`Benefits${x + 1}_label`)}</label>
          </CardTitle>
          <CardDescription>
            {t.rich(`Benefits${x + 1}_description`, {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return cards;
};

const BuiltWith = () => {
  const cards = Cards();
  return (
    <section
      id="benefits"
      className={`flex flex-col bg-neutral-100 dark:bg-neutral-800 sm:py-10`}
    >
      <div
        className={`flex-1 flex items-center flex-col xl:px-0 sm:px-16 m-10 xl:m-0 justify-center pb-20`}
      >
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 xl:gap-10 md:gap-10 gap-5 mt-2 grayscale xl:mx-10">
          {cards}
        </div>
      </div>
    </section>
  );
};

export default BuiltWith;
