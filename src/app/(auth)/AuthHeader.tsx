'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AuthHeader() {
  const pathname = usePathname();
  const isLogin = pathname === '/login';

  return (
    <header className="flex items-center justify-between px-4 py-4">
      {/* Close / back */}
      <Link
        href="/"
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#8a9eb0] hover:bg-white/5 transition-colors text-xl font-light"
        aria-label="Close"
      >
        ✕
      </Link>

      {/* Toggle auth page */}
      <Link
        href={isLogin ? '/register' : '/login'}
        className="rounded-xl border-2 border-[#3a4e5a] px-5 py-2 text-sm font-extrabold text-[#c8d8e0] uppercase tracking-wider hover:bg-white/5 transition-colors"
      >
        {isLogin ? 'Sign up' : 'Log in'}
      </Link>
    </header>
  );
}
