'use client';

import { ReactNode } from 'react';
import ThemeSwitcher from '../theme-switcher';
import {
  Button,
  SheetContent,
  SheetTrigger,
  Sheet,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SheetTitle,
} from '@ts/uikit';
import { Link } from '@web-app/navigation';
import { useLogout } from '@web-app/core/api/auth';
import {
  Bell,
  CircleEllipsis,
  Home,
  LucideIcon,
  PanelLeft,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

type Props = {
  children: ReactNode;
};

const NAV_ITEMS = [
  {
    href: '/app',
    icon: Home,
    text: 'Home',
  },
  {
    href: '/app/activity',
    icon: Bell,
    text: 'Activity',
  },
];

const isActive = ({ pathname, href }: { href: string; pathname: string }) => {
  const path = pathname.replace(/^\/[a-z]{2}\//, '/');

  return path === href;
};

const MoreOptionsItem = ({
  align = 'end',
}: {
  align?: 'end' | 'center' | 'start' | undefined;
}) => {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Link
          href="#"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
        >
          <CircleEllipsis className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Link>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuItem onClick={() => router.push('/app/settings')}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => doLogout()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
      className={`flex flex-col m-2 h-9 w-9 items-center justify-center rounded-lg text-${
        isActive({ href, pathname }) ? 'accent' : 'muted'
      }-foreground transition-colors hover:text-foreground md:h-10 md:w-10`}
      aria-label={text}
    >
      <Icon className="h-5 w-5" />
      <p className="text-xs text-center">{text}</p>
    </Link>
  );
};

const SidebarItemMobile = ({
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
      className={`flex items-center gap-4 px-2.5 ${
        isActive({ href, pathname })
          ? 'text-foreground'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon className="h-5 w-5" />
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
            <SidebarItemMobile
              key={index}
              href={item.href}
              Icon={item.icon}
              text={item.text}
            />
          ))}
        </nav>

        <nav className="grid grid-cols-1 place-items-end w-full grow">
          <MoreOptionsItem />
        </nav>
      </SheetContent>
    </Sheet>
  );
};

const AppRoot = ({ children }: Props) => {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 xl:w-24 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {NAV_ITEMS.map((item, index) => (
            <SidebarItem
              key={index}
              href={item.href}
              Icon={item.icon}
              text={item.text}
            />
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <MoreOptionsItem align="start" />
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-10 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sidebar />
          <div className="relative ml-auto md:grow-0 flex justify-end">
            <ThemeSwitcher className="xl:w-8 xl:h-8 xl:p-2" />
          </div>
        </header>
        <div className="xl:mx-16">{children}</div>
      </div>
    </>
  );
};

export default AppRoot;
