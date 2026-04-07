'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FREE_TIER_LIMITS } from '@/shared/constants';
import { getStreakEmoji } from '@/shared/lib/utils';

// ─── Animation helpers ────────────────────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

// ─── Shared card shell ────────────────────────────────────────────────────────

function StatCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border-2 border-[#E8ECF4] shadow-[0_4px_0_#D1D7E8] p-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-extrabold text-[#7B8FB5] uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

// ─── StudyStreakCard ──────────────────────────────────────────────────────────

interface StudyStreakCardProps { streak: number }

export function StudyStreakCard({ streak }: StudyStreakCardProps) {
  return (
    <motion.div variants={item}>
      <StatCard>
        <SectionLabel>Study Streak</SectionLabel>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-extrabold text-[#27355B] leading-none">{streak}</p>
            <p className="text-xs text-[#7B8FB5] font-medium mt-1">day streak</p>
          </div>
          <span className="text-5xl leading-none">{getStreakEmoji(streak)}</span>
        </div>
      </StatCard>
    </motion.div>
  );
}

// ─── TaskProgressCard ─────────────────────────────────────────────────────────

interface TaskProgressCardProps { completed: number; total: number }

export function TaskProgressCard({ completed, total }: TaskProgressCardProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const done = completed === total && total > 0;

  return (
    <motion.div variants={item}>
      <StatCard>
        <SectionLabel>Today&lsquo;s Tasks</SectionLabel>
        <div className="flex items-end justify-between mb-3">
          <p className="text-4xl font-extrabold text-[#27355B] leading-none">{pct}%</p>
          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${done ? 'bg-[#58CC02]/10 text-[#58CC02]' : 'bg-[#EEF2FA] text-[#7B8FB5]'}`}>
            {completed}/{total}
          </span>
        </div>
        <div className="h-3 rounded-full bg-[#EEF2FA] overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${done ? 'bg-[#58CC02]' : 'bg-[#1CB0F6]'}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        </div>
      </StatCard>
    </motion.div>
  );
}

// ─── AIUsageCard ──────────────────────────────────────────────────────────────

interface AIUsageCardProps { summariesUsed: number; quizzesUsed: number; isPremium: boolean }

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-2 rounded-full bg-[#EEF2FA] overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}

export function AIUsageCard({ summariesUsed, quizzesUsed, isPremium }: AIUsageCardProps) {
  if (isPremium) {
    return (
      <motion.div variants={item}>
        <StatCard>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#FFFBEB] text-xl shrink-0">✨</div>
            <div>
              <p className="font-extrabold text-[#27355B] text-sm">AI Usage</p>
              <p className="text-xs text-[#7B8FB5]">Unlimited — Premium</p>
            </div>
            <span className="ml-auto text-xs font-extrabold bg-[#F5C542] text-[#27355B] px-3 py-1 rounded-full shadow-[0_2px_0_#CFA830]">
              PRO
            </span>
          </div>
        </StatCard>
      </motion.div>
    );
  }

  return (
    <motion.div variants={item}>
      <StatCard>
        <SectionLabel>AI Usage — Free Tier</SectionLabel>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-[#27355B]">Summaries</span>
              <span className="text-[#7B8FB5]">{summariesUsed}/{FREE_TIER_LIMITS.summariesPerDay}</span>
            </div>
            <MiniBar value={summariesUsed} max={FREE_TIER_LIMITS.summariesPerDay} color="#F5C542" />
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-[#27355B]">Quizzes</span>
              <span className="text-[#7B8FB5]">{quizzesUsed}/{FREE_TIER_LIMITS.quizzesPerDay}</span>
            </div>
            <MiniBar value={quizzesUsed} max={FREE_TIER_LIMITS.quizzesPerDay} color="#1CB0F6" />
          </div>
        </div>
      </StatCard>
    </motion.div>
  );
}

// ─── QuickActionsGrid ─────────────────────────────────────────────────────────

const quickActions = [
  { label: 'New Task',   emoji: '✅', href: '/tasks/create',      bg: 'bg-[#F0FDF4]', shadow: '#BBF7D0' },
  { label: 'Summary',   emoji: '📄', href: '/ai-tools/summary',   bg: 'bg-[#FFFBEB]', shadow: '#FDE68A' },
  { label: 'AI Quiz',   emoji: '🧠', href: '/ai-tools/quiz',      bg: 'bg-[#EFF6FF]', shadow: '#BFDBFE' },
  { label: 'Daily Quiz',emoji: '🔥', href: '/daily-quiz',         bg: 'bg-[#FFF7ED]', shadow: '#FED7AA' },
  { label: 'Tutor',     emoji: '🤖', href: '/tutor',              bg: 'bg-[#F5F3FF]', shadow: '#DDD6FE' },
  { label: 'Pomodoro',  emoji: '⏱️', href: '/pomodoro',           bg: 'bg-[#FFF1F2]', shadow: '#FECDD3' },
];

export function QuickActionsGrid() {
  return (
    <motion.div variants={item}>
      <StatCard>
        <SectionLabel>Quick Actions</SectionLabel>
        <div className="grid grid-cols-3 gap-2.5">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ y: 2 }}
                className={`flex flex-col items-center gap-2 rounded-2xl p-3.5 transition-colors ${action.bg} border-2 border-transparent hover:border-[#27355B]/10`}
                style={{ boxShadow: `0 3px 0 ${action.shadow}` }}
              >
                <span className="text-2xl leading-none">{action.emoji}</span>
                <span className="text-[10px] font-extrabold text-[#27355B] text-center leading-tight uppercase tracking-wide">
                  {action.label}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </StatCard>
    </motion.div>
  );
}

// ─── DashboardGrid ────────────────────────────────────────────────────────────

export function DashboardGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {children}
    </motion.div>
  );
}
