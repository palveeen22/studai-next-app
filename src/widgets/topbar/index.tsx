'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles } from 'lucide-react';
import {
  LayoutDashboard,
  CheckSquare,
  MessageCircle,
  Flame,
  Timer,
  User,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { NAV_ITEMS } from '@/shared/constants';
import { Sheet } from '@/shared/ui/components';
import { Button } from '@/shared/ui/button';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  MessageCircle,
  Flame,
  Timer,
  User,
};

export function Topbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Sparkles className="h-4 w-4 text-[#2D2D2D]" />
          </div>
          <span className="font-bold text-gray-900">StudAI</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen} side="left">
        <div className="flex h-full flex-col bg-[#2D2D2D]">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <Sparkles className="h-4 w-4 text-[#2D2D2D]" />
              </div>
              <span className="font-bold text-white">StudAI</span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-1 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-accent/15 text-accent'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  )}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </Sheet>
    </>
  );
}
