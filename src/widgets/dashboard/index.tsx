'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Flame,
  Sparkles,
  MessageCircle,
  Timer,
  Plus,
  FileText,
  BrainCircuit,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/components';
import { ProgressBar } from '@/shared/ui/custom';
import { getStreakEmoji } from '@/shared/lib/utils';
import { FREE_TIER_LIMITS } from '@/shared/constants';

// ============================================
// Stagger animation wrapper
// ============================================
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// ============================================
// StudyStreakCard
// ============================================
interface StudyStreakCardProps {
  streak: number;
}

export function StudyStreakCard({ streak }: StudyStreakCardProps) {
  return (
    <motion.div variants={item}>
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Study Streak</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">
                {streak} <span className="text-base font-normal text-gray-500">days</span>
              </p>
            </div>
            <span className="text-4xl">{getStreakEmoji(streak)}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ============================================
// TaskProgressCard
// ============================================
interface TaskProgressCardProps {
  completed: number;
  total: number;
}

export function TaskProgressCard({ completed, total }: TaskProgressCardProps) {
  return (
    <motion.div variants={item}>
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">Today&apos;s Tasks</p>
            <Badge variant={completed === total && total > 0 ? 'accent' : 'secondary'}>
              {completed}/{total}
            </Badge>
          </div>
          <ProgressBar value={completed} max={total || 1} showPercentage />
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================
// AIUsageCard
// ============================================
interface AIUsageCardProps {
  summariesUsed: number;
  quizzesUsed: number;
  isPremium: boolean;
}

export function AIUsageCard({ summariesUsed, quizzesUsed, isPremium }: AIUsageCardProps) {
  if (isPremium) {
    return (
      <motion.div variants={item}>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <p className="text-sm font-medium text-gray-500">AI Usage</p>
              <Badge variant="accent">Unlimited</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={item}>
      <Card>
        <CardContent className="p-5">
          <p className="text-sm font-medium text-gray-500 mb-3">AI Usage (Free Tier)</p>
          <div className="space-y-2">
            <ProgressBar
              value={summariesUsed}
              max={FREE_TIER_LIMITS.summariesPerDay}
              label="Summaries"
              color="#2ECC71"
            />
            <ProgressBar
              value={quizzesUsed}
              max={FREE_TIER_LIMITS.quizzesPerDay}
              label="Quizzes"
              color="#3498DB"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================
// QuickActionsGrid
// ============================================
const quickActions = [
  { label: 'Create Task', icon: Plus, href: '/tasks/create', color: '#2ECC71' },
  { label: 'AI Summary', icon: FileText, href: '/ai-tools/summary', color: '#F5C542' },
  { label: 'AI Quiz', icon: BrainCircuit, href: '/ai-tools/quiz', color: '#3498DB' },
  { label: 'Daily Quiz', icon: Flame, href: '/daily-quiz', color: '#E67E22' },
  { label: 'AI Tutor', icon: MessageCircle, href: '/tutor', color: '#9B59B6' },
  { label: 'Pomodoro', icon: Timer, href: '/pomodoro', color: '#E74C3C' },
];

export function QuickActionsGrid() {
  return (
    <motion.div variants={item}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: action.color + '20' }}
                  >
                    <action.icon className="h-5 w-5" style={{ color: action.color }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">
                    {action.label}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================
// DashboardGrid (container)
// ============================================
export function DashboardGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {children}
    </motion.div>
  );
}
