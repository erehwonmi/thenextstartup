'use client';

import { ReactNode } from 'react';

import Link from 'next/link';
import { CircleUser, LucideIcon, Menu, Users, UsersRound } from 'lucide-react';

import {
  Sheet,
  Button,
  SheetTrigger,
  SheetContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@ts/uikit';
import { usePathname, useRouter } from 'next/navigation';
import { useLogout } from '@admin-web/core/api/auth';

type Props = {
  children: ReactNode;
};

const NAV_ITEMS = [
  {
    href: '/app',
    icon: Users,
    text: 'Customers',
  },
  {
    href: '/app/admins',
    icon: UsersRound,
    text: 'Admins',
  },
];

const isActive = ({ pathname, href }: { href: string; pathname: string }) => {
  const path = pathname.replace(/^\/[a-z]{2}\//, '/');

  return path === href;
};

const SidebarItem = ({
  href,
  Icon,
  text,
}: {
  href: string;
  Icon: LucideIcon;
  text: string;
}) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-${
        isActive({ href, pathname }) ? 'accent' : 'muted'
      }-foreground transition-all hover:text-primary`}
    >
      <Icon className="h-4 w-4" />
      {text}
    </Link>
  );
};

const SidebarMobileItem = ({
  href,
  Icon,
  text,
}: {
  href: string;
  Icon: LucideIcon;
  text: string;
}) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-${
        isActive({ href, pathname }) ? 'accent' : 'muted'
      }-foreground hover:text-foreground`}
    >
      <Icon className="h-5 w-5" />
      {text}
    </Link>
  );
};

const AppRoot = ({ children }: Props) => {
  const { mutate: logout } = useLogout();
  const router = useRouter();

  const doLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push('/');
        router.refresh();
      },
    });
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <h1 className="bg-gradient-to-r dark:from-white from-black dark:to-zinc-400 to-neutral-700 bg-clip-text text-transparent font-bungeeShade font-semibold text-xl">
                TheNextStartup
              </h1>
              <span className="sr-only">TheNextStartup</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {NAV_ITEMS.map((item, idx) => (
                <SidebarItem
                  key={idx}
                  href={item.href}
                  text={item.text}
                  Icon={item.icon}
                />
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <h1 className="bg-gradient-to-r dark:from-white from-black dark:to-zinc-400 to-neutral-700 bg-clip-text text-transparent font-josefinSans font-semibold text-xl">
                    The <label className="font-pacifico">Next</label> Startup
                  </h1>
                  <span className="sr-only">TheNextStartup</span>
                </Link>

                {NAV_ITEMS.map((item, idx) => (
                  <SidebarMobileItem
                    key={idx}
                    href={item.href}
                    text={item.text}
                    Icon={item.icon}
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => doLogout()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppRoot;
