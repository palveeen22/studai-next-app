'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';

const TABS = [
  { href: '/dashboard', label: 'Home' },
  { href: '/daily-quiz', label: 'Quiz' },
  { href: '/ai-tools', label: 'Tools' },
  { href: '/tutor', label: 'Tutor' },
  { href: '/profile', label: 'Profile' },
] as const;

// ─── Inline SVG icons ────────────────────────────────────────────────────────

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      {active ? (
        <path fill="currentColor" d="M12 3L2 12h3v8h14v-8h3z" />
      ) : (
        <path
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          d="M12 3L2 12h3v8h14v-8h3z"
        />
      )}
    </svg>
  );
}

function FlameIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      {active ? (
        <path
          fill="currentColor"
          d="M12 2C9.5 6 7 8.5 7 13a5 5 0 0010 0c0-4.5-2.5-7-5-11z"
        />
      ) : (
        <path
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 2C9.5 6 7 8.5 7 13a5 5 0 0010 0c0-4.5-2.5-7-5-11z"
        />
      )}
    </svg>
  );
}

function SparkleIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      {active ? (
        <path
          fill="currentColor"
          d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2 2-8z"
        />
      ) : (
        <path
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2 2-8z"
        />
      )}
    </svg>
  );
}

function ChatIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      {active ? (
        <path
          fill="currentColor"
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        />
      ) : (
        <path
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        />
      )}
    </svg>
  );
}

function PersonIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <circle fill="currentColor" cx="12" cy="8" r="4" />
          <path fill="currentColor" d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6H4z" />
        </>
      ) : (
        <>
          <circle stroke="currentColor" strokeWidth="2" cx="12" cy="8" r="4" />
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"
          />
        </>
      )}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const TAB_ICONS: Record<string, (active: boolean) => React.ReactNode> = {
  '/dashboard': (a) => <HomeIcon active={a} />,
  '/daily-quiz': (a) => <FlameIcon active={a} />,
  '/ai-tools': (a) => <SparkleIcon active={a} />,
  '/tutor': (a) => <ChatIcon active={a} />,
  '/profile': (a) => <PersonIcon active={a} />,
};

export function MobileTabbar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex h-14">
        {TABS.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + '/');

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex-1 flex items-center justify-center transition-colors',
                isActive ? 'text-[#58CC02]' : 'text-gray-400'
              )}
            >
              {TAB_ICONS[tab.href](isActive)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
