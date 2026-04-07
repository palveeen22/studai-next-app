'use client';

import { Skeleton } from '@/shared/ui/components';
import { ButtonCustom } from '@/shared/ui/buttonCustom';
import { useDailyQuizTasksQuery } from '@/features/daily-quiz/model/useDailyQuizTasks';
import { QuizTaskCard } from '@/features/daily-quiz/ui/QuizTaskCard';

function FlameIcon() {
  return (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none">
      <path fill="#FF9600" d="M12 2C9.5 6 7 8.5 7 13a5 5 0 0010 0c0-4.5-2.5-7-5-11z" />
      <path fill="#FF4B00" d="M12 10c-1 2-1.5 3.5-1 5a2 2 0 004 0c.5-1.5 0-3-1-5l-1 1-1-1z" />
    </svg>
  );
}

export default function DailyQuizPage() {
  const { data: tasks, isLoading } = useDailyQuizTasksQuery();
  const activeTasks = tasks?.filter((t) => !t.is_archived) || [];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-[#27355B]">Daily Quiz</h1>
            <p className="text-sm text-[#7B8FB5] mt-0.5 font-medium">
              Build consistency with daily practice
            </p>
          </div>
          <ButtonCustom href="/daily-quiz/create" color="green" size="sm">
            + New
          </ButtonCustom>
        </div>

        {/* Streak banner */}
        {activeTasks.length > 0 && (
          <div className="bg-[#27355B] rounded-2xl p-4 mb-6 flex items-center gap-4 shadow-[0_4px_0_#172140]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 shrink-0">
              <FlameIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-extrabold text-sm">Keep your streak going!</p>
              <p className="text-[#8FA4CC] text-xs mt-0.5">
                You have {activeTasks.length} active challenge{activeTasks.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[#F5C542] text-2xl font-extrabold leading-none">
                {Math.max(...activeTasks.map((t) => t.current_streak), 0)}
              </p>
              <p className="text-[#8FA4CC] text-[10px] font-bold uppercase tracking-wider">streak</p>
            </div>
          </div>
        )}

        {/* Task list */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : activeTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#f0f4ff] mb-5">
              <FlameIcon />
            </div>
            <h3 className="text-lg font-extrabold text-[#27355B] mb-2">No challenges yet</h3>
            <p className="text-[#7B8FB5] text-sm mb-6 max-w-xs">
              Create your first daily quiz challenge to build a consistent study habit.
            </p>
            <ButtonCustom href="/daily-quiz/create" color="green" size="md">
              Create Challenge
            </ButtonCustom>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <QuizTaskCard key={task.id} task={task} completedDays={task.current_streak} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
