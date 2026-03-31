'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  MessageCircle,
  Flame,
  Timer,
  User,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { NAV_ITEMS } from '@/shared/constants';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  MessageCircle,
  Flame,
  Timer,
  User,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-[#2D2D2D]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
          <Sparkles className="h-5 w-5 text-[#2D2D2D]" />
        </div>
        <span className="text-lg font-bold text-white">StudAI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
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

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <p className="text-xs text-gray-500">© 2025 StudAI</p>
      </div>
    </aside>
  );
}
