'use client';

import { ReactNode } from 'react';
import {
  Button,
  SheetContent,
  SheetTrigger,
  Sheet,
  SheetTitle,
} from '@ts/uikit';
import { Link } from '@web-app/navigation';
import { ChevronLeft, PanelLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

type Props = {
  children: ReactNode;
};

const NAV_ITEMS = [
  {
    href: '/app/settings',
    text: 'General',
  },
  {
    href: '/app/settings/plans',
    text: 'Plans',
  },
];

const isActive = ({ pathname, href }: { href: string; pathname: string }) => {
  const path = pathname.replace(/^\/[a-z]{2}\//, '/');

  return path === href;
};

const SidebarItem = ({ href, text }: { href: string; text: string }) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`text-sm text-start flex flex-col h-9 w-9 text-${
        isActive({ href, pathname }) ? 'accent' : 'muted'
      }-foreground transition-colors hover:text-foreground md:h-10 md:w-10`}
      aria-label={text}
    >
      {text}
    </Link>
  );
};

const SidebarItemMobile = ({ href, text }: { href: string; text: string }) => {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-2.5 ${
        isActive({ href, pathname })
          ? 'text-foreground'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {text}
    </Link>
  );
};

const Sidebar = () => {
  return (
    <Sheet>
      <SheetTitle></SheetTitle>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs flex flex-col">
        <nav className="grid gap-6 text-lg font-medium">
          {NAV_ITEMS.map((item, index) => (
            <SidebarItemMobile key={index} href={item.href} text={item.text} />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

const SettingsRoot = ({ children }: Props) => {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-48 xl:w-48 flex-col border-r bg-background sm:flex">
        <div className="ml-2 flex flex-row gap-1 items-start mt-5">
          <Link href={'/app'}>
            <ChevronLeft className="h-7 w-7 p-1.5" />
          </Link>

          <h1 className="text-base font-semibold">Settings</h1>
        </div>
        <nav className="flex flex-col items-left ml-7 px-2 sm:py-5">
          {NAV_ITEMS.map((item, index) => (
            <SidebarItem key={index} href={item.href} text={item.text} />
          ))}
        </nav>
      </aside>
      <div className="flex flex-col xl:flex-row sm:gap-10 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sidebar />
          <div className="flex flex-row font-semibold xl:hidden lg:hidden md:hidden sm:block">
            <Link href={'/app'}>
              <ChevronLeft className="h-7 w-7 p-1.5" />
            </Link>
            <h5>Settings</h5>
          </div>
        </header>
        <div className="w-full px-5 py-10 lg:pl-40 md:pl-48">{children}</div>
      </div>
    </>
  );
};

export default SettingsRoot;
