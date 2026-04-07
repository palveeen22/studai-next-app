'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { apiClient } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { DashboardData } from '@/shared/types';
import { getGreeting } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/components';
import {
  DashboardGrid,
  StudyStreakCard,
  TaskProgressCard,
  AIUsageCard,
  QuickActionsGrid,
} from '@/widgets/dashboard';
import { TaskList } from '@/features/tasks/ui/TaskList';
import { useToggleTaskMutation, useDeleteTaskMutation } from '@/features/tasks/model/useTasks';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await apiClient.get<DashboardData>(ENDPOINTS.dashboard);
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
  });

  const toggleMutation = useToggleTaskMutation();
  const deleteMutation = useDeleteTaskMutation();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-24 rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!data) return null;

  const isPremium = data.subscription?.tier !== 'free';

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Hero greeting */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#27355B] rounded-2xl p-5 mb-6 border-b-4 border-[#172140] relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#fff 1px,transparent 1px)', backgroundSize: '20px 20px' }}
          />
          <p className="text-[#8FA4CC] text-[10px] font-extrabold uppercase tracking-widest mb-1 relative z-10">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-white text-xl font-extrabold relative z-10">
            {getGreeting()}, {data.user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-[#6A85AF] text-sm mt-0.5 relative z-10">Ready to level up today?</p>
        </motion.div>

        <DashboardGrid>
          {/* Streak + Tasks side by side */}
          <div className="grid grid-cols-2 gap-4">
            <StudyStreakCard streak={data.streak} />
            <TaskProgressCard
              completed={data.todayTasks.completed}
              total={data.todayTasks.total}
            />
          </div>

          <AIUsageCard
            summariesUsed={data.aiUsage.summaries_used}
            quizzesUsed={data.aiUsage.quizzes_used}
            isPremium={isPremium}
          />

          <QuickActionsGrid />

          {/* Recent tasks */}
          <motion.div
            className="bg-white rounded-2xl border-2 border-[#E8ECF4] shadow-[0_4px_0_#D1D7E8] p-5"
          >
            <p className="text-[10px] font-extrabold text-[#7B8FB5] uppercase tracking-widest mb-4">
              Recent Tasks
            </p>
            <TaskList
              tasks={data.recentTasks}
              onToggle={(id) => toggleMutation.mutate(id)}
              onDelete={(id) => deleteMutation.mutate(id)}
              showSubject
              emptyMessage="No tasks yet"
            />
          </motion.div>
        </DashboardGrid>
      </div>
    </div>
  );
}
