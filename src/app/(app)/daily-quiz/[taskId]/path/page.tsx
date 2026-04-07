'use client';

import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/shared/ui/components';
import { useDailyQuizTasksQuery, useDailyQuizResultsQuery } from '@/features/daily-quiz/model/useDailyQuizTasks';
import { DuolingoPath } from '@/features/daily-quiz/ui/DuolingoPath';
import { motion } from 'framer-motion';

const GOAL_EMOJI: Record<string, string> = {
  interview: '🎯', exam: '📝', test: '✅', practice: '💪',
};

export default function DailyQuizPathPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const router = useRouter();
  const { data: tasks } = useDailyQuizTasksQuery();
  const { data: results, isLoading } = useDailyQuizResultsQuery(taskId);

  const task = tasks?.find((t) => t.id === taskId);
  const completedDays = results?.length ?? 0;

  if (isLoading || !task) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Skeleton className="h-150 rounded-2xl" />
      </div>
    );
  }

  const pct = Math.round((completedDays / task.duration) * 100);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto py-6">
        <div className="flex gap-8 items-start">

          {/* ── Main column ── */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="px-4 lg:px-0">

              {/* Back */}
              <button
                onClick={() => router.push('/daily-quiz')}
                className="flex items-center gap-1.5 text-sm font-bold text-[#7B8FB5] hover:text-[#27355B] transition-colors mb-5"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                </svg>
                Daily Quiz
              </button>

              {/* Section banner */}
              <div className="relative bg-[#27355B] rounded-2xl p-5 mb-4 flex items-center justify-between border-b-4 border-[#172140] overflow-hidden">
                {/* subtle dot pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(#fff 1px,transparent 1px)', backgroundSize: '18px 18px' }}
                />
                <div className="relative z-10">
                  <p className="text-[#8FA4CC] text-[10px] font-extrabold uppercase tracking-widest mb-1">
                    Daily Quiz · {completedDays}/{task.duration} days
                  </p>
                  <h2 className="text-white text-xl font-extrabold leading-tight">{task.title}</h2>
                  <p className="text-[#6A85AF] text-sm mt-0.5">{task.topic}</p>
                </div>
                <div className="relative z-10 shrink-0 ml-4 flex flex-col items-center gap-1">
                  <span className="text-3xl">{GOAL_EMOJI[task.preparation_goal] ?? '📚'}</span>
                  <span className="text-[10px] font-extrabold text-[#F5C542] uppercase tracking-wider">
                    {task.preparation_goal}
                  </span>
                </div>
              </div>
            </div>

            {/* Path */}
            <DuolingoPath
              totalDays={task.duration}
              results={results || []}
              topic={task.topic}
              onPlayDay={(dayIndex) =>
                router.push(`/daily-quiz/${taskId}/play?day=${dayIndex}`)
              }
            />
          </div>

          {/* ── Stats sidebar (desktop) ── */}
          <div className="hidden lg:flex flex-col w-60 shrink-0 sticky top-6 gap-3 pr-4">

            {/* Streak */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl border-2 border-[#E8ECF4] shadow-[0_4px_0_#D1D7E8] p-4"
            >
              <p className="text-[10px] font-extrabold text-[#7B8FB5] uppercase tracking-widest mb-3">
                Current Streak
              </p>
              <div className="flex items-center gap-3">
                <span className="text-4xl leading-none">🔥</span>
                <div>
                  <p className="text-3xl font-extrabold text-[#27355B] leading-none">
                    {task.current_streak}
                  </p>
                  <p className="text-xs text-[#7B8FB5] mt-0.5 font-medium">day streak</p>
                </div>
              </div>
            </motion.div>

            {/* Progress */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border-2 border-[#E8ECF4] shadow-[0_4px_0_#D1D7E8] p-4"
            >
              <p className="text-[10px] font-extrabold text-[#7B8FB5] uppercase tracking-widest mb-3">
                Progress
              </p>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-extrabold text-[#27355B]">{pct}%</span>
                <span className="text-xs text-[#7B8FB5] font-medium">{completedDays}/{task.duration}d</span>
              </div>
              <div className="h-3 rounded-full bg-[#EEF2FA] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#58CC02]"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p className="text-[10px] text-[#7B8FB5] mt-1.5 font-medium">
                {task.duration - completedDays > 0
                  ? `${task.duration - completedDays} days left`
                  : 'All done! 🎉'}
              </p>
            </motion.div>

            {/* Best streak */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl border-2 border-[#E8ECF4] shadow-[0_4px_0_#D1D7E8] p-4"
            >
              <p className="text-[10px] font-extrabold text-[#7B8FB5] uppercase tracking-widest mb-3">
                Best Streak
              </p>
              <div className="flex items-center gap-3">
                <span className="text-4xl leading-none">🏆</span>
                <div>
                  <p className="text-3xl font-extrabold text-[#27355B] leading-none">
                    {task.longest_streak}
                  </p>
                  <p className="text-xs text-[#7B8FB5] mt-0.5 font-medium">days</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
