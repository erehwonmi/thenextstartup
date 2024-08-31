'use client';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '../navigation';
import ShowcaseMobile from './showcase-mobile';
import { Github } from 'lucide-react';
import ShowcaseLaptop from './showcase-laptop';
import { cn } from '@ts/uikit-utils';

const Hero = () => {
  const locale = useLocale();

  let urlMobile = 'https://app.supademo.com/embed/clzfjih6c0zux9x77zxw0d8hw';
  let urlLaptop = 'https://app.supademo.com/embed/clzfj4kif0zu79x77zku9zki8';

  switch (locale) {
    case 'jp': {
      urlMobile = 'https://app.supademo.com/embed/clzfm930c00xpkpbx7jsh15u3';
      urlLaptop = 'https://app.supademo.com/embed/clzflyhno00ukkpbx35qhrgfk';
      break;
    }
    default: {
      urlMobile = 'https://app.supademo.com/embed/clzfjih6c0zux9x77zxw0d8hw';
      urlLaptop = 'https://app.supademo.com/embed/clzfj4kif0zu79x77zku9zki8';
    }
  }

  const t = useTranslations('Hero');

  return (
    <section
      id="hero"
      className={`flex flex-col bg-gradient-to-b from-yellow-800 dark:via-neutral-900 via-neutral-300 dark:to-black to-white sm:py-16 py-6`}
    >
      <div
        className={`flex-1 flex items-center flex-col xl:px-0 sm:px-16 pt-12 m-10 xl:m-10 justify-center text-center`}
      >
        <h1
          className={`p-10 py-16 text-black dark:text-white flex-1 font-bungeeShade font-semibold ss:text-xs text-4xl lg:text-[70px] lg:leading-[100px]`}
        >
          The <label>Next</label> Startup
        </h1>
        <p className="font-notoSans my-8 lg:text-base text-sm dark:text-white text-black line-clamp-3 lg:px-48">
          {t.rich('description', {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex justify-center xl:flex-row md:flex-row flex-col gap-5 mx-auto">
          <Link
            className={cn(
              'xl:text-base text-sm font-semibold flex xl:w-52 xl:h-14 w-40 h-16 bg-white text-black rounded-xl items-center justify-center cursor-pointer',
              { 'xl:w-72 w-58': locale === 'jp' }
            )}
            href={'https://thenextstartupdocs.erehwonmi.com/'}
            target="_blank"
          >
            {t.rich('getStarted')}
          </Link>
          <Link
            className={cn(
              'flex xl:w-52 xl:h-14 w-40 h-16 animate-border bg-gradient-to-tl from-neutral-900 via-yellow-400 to-amber-800 bg-[length:500%_200%] text-black rounded-xl items-center justify-center cursor-pointer',
              { 'xl:w-72 w-64': locale === 'jp' }
            )}
            href={'https://github.com'}
            target="_blank"
          >
            <div className="flex bg-neutral-100 border border-black border-opacity-50 xl:px-9 xl:py-1 md:px-6 md:py-3 px-6 py-3 rounded-xl">
              <div className="mr-6">
                <Github className="xl:mt-2 md:mt-2 mt-1" />
              </div>
              <div>
                {t.rich('starOnGithub', {
                  star: (chunks) => <div className="text-xs">{chunks}</div>,
                  github: (chunks) => (
                    <div className="xl:text-xl font-semibold font-josefinSans -mt-1 text-sm">
                      {chunks}
                    </div>
                  ),
                })}
              </div>
            </div>
          </Link>
        </div>
      </div>

      <ShowcaseMobile url={urlMobile} />
      <ShowcaseLaptop url={urlLaptop} />
    </section>
  );
};

export default Hero;
