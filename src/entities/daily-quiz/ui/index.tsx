'use client';

import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { Star, Lock } from 'lucide-react';

// ============================================
// QuizDayNode
// ============================================
type NodeStatus = 'completed' | 'current' | 'locked';

interface QuizDayNodeProps {
  dayIndex: number;
  status: NodeStatus;
  score?: number;
  onClick?: () => void;
}

export function QuizDayNode({ status, score, onClick }: QuizDayNodeProps) {
  return (
    <motion.button
      whileHover={status !== 'locked' ? { scale: 1.1, y: -2 } : undefined}
      whileTap={status !== 'locked' ? { scale: 0.95, y: 3 } : undefined}
      onClick={status !== 'locked' ? onClick : undefined}
      disabled={status === 'locked'}
      className={cn(
        'relative flex h-[68px] w-[68px] items-center justify-center rounded-full transition-all select-none',
        status === 'completed' && 'bg-[#58CC02] shadow-[0_5px_0_#46A302]',
        status === 'current' && 'bg-[#58CC02] shadow-[0_5px_0_#46A302]',
        status === 'locked' && 'bg-[#E5E7EB] shadow-[0_5px_0_#C4C9D0] cursor-not-allowed',
      )}
    >
      {status === 'completed' && <Star className="h-7 w-7 fill-white text-white" />}
      {status === 'current' && <Star className="h-8 w-8 fill-white text-white" />}
      {status === 'locked' && <Lock className="h-6 w-6 text-[#A0A8B4]" />}

      {status === 'completed' && score !== undefined && (
        <span className="absolute -top-2 -right-1 flex min-w-[24px] h-6 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-extrabold text-[#46A302] shadow-sm border border-gray-100">
          {score}%
        </span>
      )}
    </motion.button>
  );
}

// ============================================
// QuizStreakBadge
// ============================================
interface QuizStreakBadgeProps {
  streak: number;
  className?: string;
}

export function QuizStreakBadge({ streak, className }: QuizStreakBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600',
        className
      )}
    >
      <span>🔥</span>
      {streak} day{streak !== 1 ? 's' : ''}
    </div>
  );
}
