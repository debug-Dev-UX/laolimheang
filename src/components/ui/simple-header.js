import React from 'react';
import { Grid2x2PlusIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter } from './sheet';
import { Button, buttonVariants } from './shadcn-button';
import { MenuToggle } from './menu-toggle';

export function SimpleHeader() {
  const [open, setOpen] = React.useState(false);

  const links = [
    {
      label: 'Features',
      href: '#',
    },
    {
      label: 'Pricing',
      href: '#',
    },
    {
      label: 'About',
      href: '#',
    },
  ];

  return (
    <header className="bg-white/95 dark:bg-dark-900/95 supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-dark-900/80 sticky top-0 z-50 w-full border-b border-dark-200 dark:border-dark-800 backdrop-blur-lg">
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Grid2x2PlusIcon className="h-6 w-6" />
          <p className="font-mono text-lg font-bold">Asme</p>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              className={buttonVariants({ variant: 'ghost' })}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
          <Button variant="outline">Sign In</Button>
          <Button>Get Started</Button>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <Button size="icon" variant="outline" className="lg:hidden" onClick={() => setOpen(!open)}>
            <MenuToggle
              strokeWidth={2.5}
              open={open}
              onOpenChange={setOpen}
              className="h-6 w-6"
            />
          </Button>
          <SheetContent
            className="bg-white/95 dark:bg-dark-900/95 supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-dark-900/80 gap-0 backdrop-blur-lg"
            showClose={false}
            side="left"
          >
            <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
              {links.map((link) => (
                <a
                  key={link.label}
                  className={buttonVariants({
                    variant: 'ghost',
                    className: 'justify-start',
                  })}
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <SheetFooter>
              <Button variant="outline">Sign In</Button>
              <Button>Get Started</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
