'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@ts/uikit';
import ThemeSwitcher from './theme-switcher';
import { useRouter } from 'next/navigation';
import { CurrentCustomer } from '@web-app/core/server/session';

const Header = ({ currentCustomer }: { currentCustomer: CurrentCustomer }) => {
  const router = useRouter();
  const [sticky, setSticky] = useState(false);

  const handleStickyNavbar = () => {
    if (window.scrollY >= 75) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'L' || event.key === 'l') {
      const to = currentCustomer ? '/app' : '/auth/login';
      router.push(to);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleStickyNavbar);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleStickyNavbar);
    };
  });

  return (
    <>
      <header
        className={`mt-4 ud-header left-0 top-0 z-40 flex w-full justify-center items-center ${
          sticky
            ? 'shadow-nav fixed z-40 border-b border-stroke border-transparent bg-dark/0'
            : 'absolute bg-transparent'
        }`}
      >
        <div
          className={`container border border-neutral-700 border-opacity-25 dark:border-opacity-25 dark:border-neutral-400 rounded-[12.0rem] backdrop-blur-[5px] xl:px-12 px-6`}
        >
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-40 max-w-full px-4">
              <Link
                href="/"
                className={`navbar-logo block w-full ${
                  sticky ? 'py-2' : 'py-5'
                } `}
              >
                <>
                  <Image
                    src={`/images/logo/logo-for-bg-white.svg`}
                    alt="logo"
                    width={725}
                    height={20}
                    className="w-full dark:hidden"
                  />
                  <Image
                    src={`/images/logo/logo-for-bg-dark.svg`}
                    alt="logo"
                    width={725}
                    height={20}
                    className="w-full hidden dark:block"
                  />
                </>
              </Link>
            </div>
            <div className="flex w-full flex-row items-center justify-between px-2">
              <div> </div>
              <div className="justify-end flex lg:pr-8 gap-5 pr-2">
                <div className="py-1 flex flex-row gap-1">
                  <div className="flex flex-row gap-1">
                    <Button
                      className={`w-${
                        currentCustomer ? '26' : '16'
                      } xl:w-full md:w-full text-xs md:text-sm xl:text-sm rounded-2xl bg-neutral-950 text-white hover:bg-neutral-900  border border-black border-opacity-10 p-0`}
                    >
                      <Link
                        href={currentCustomer ? '/app' : 'auth/login'}
                        className="py-2 px-4 rounded-2xl"
                      >
                        {currentCustomer ? 'Launch app' : 'Log in'}{' '}
                        <span className="bg-neutral-900 rounded-sm p-0 ml-1 text-xs">
                          L
                        </span>
                      </Link>
                    </Button>
                    {!currentCustomer && (
                      <Button className="w-16 xl:w-20 md:w-20 text-xs md:text-sm xl:text-sm rounded-2xl bg-neutral-100 text-black border border-black border-opacity-10 hover:bg-white">
                        <Link
                          href="/auth/signup"
                          className="py-2 xl:px-4 px-2 rounded-2xl"
                        >
                          Sign up
                        </Link>
                      </Button>
                    )}
                  </div>
                  <ThemeSwitcher />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
