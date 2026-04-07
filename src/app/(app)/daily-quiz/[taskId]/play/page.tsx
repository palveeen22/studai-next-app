'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/shared/ui/components';
import { ButtonCustom } from '@/shared/ui/buttonCustom';
import { QuizPlayView } from '@/features/ai-quiz/ui/QuizPanel';
import { useDailyQuizTasksQuery } from '@/features/daily-quiz/model/useDailyQuizTasks';
import { apiClient } from '@/shared/api/client';
import type { QuizQuestion } from '@/shared/types';

export default function DailyQuizPlayPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dayIndex = Number(searchParams.get('day') || 0);

  const { data: tasks } = useDailyQuizTasksQuery();
  const task = tasks?.find((t) => t.id === taskId);

  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!task) return;
    async function generateQuestions() {
      setLoading(true);
      try {
        const res = await apiClient.post<{ questions: QuizQuestion[] }>('/api/ai/quiz', {
          text: `Topic: ${task!.topic}. This is day ${dayIndex + 1} of a ${task!.duration}-day ${task!.preparation_goal} preparation challenge.`,
          count: task!.questions_per_day,
          goal: task!.preparation_goal,
        });
        if (res.data) setQuestions(res.data.questions);
      } catch (err) {
        console.error('Failed to generate questions:', err);
      } finally {
        setLoading(false);
      }
    }
    generateQuestions();
  }, [task, dayIndex]);

  const handleComplete = async (score: number) => {
    setCompleted(true);
    await apiClient.post(`/api/daily-quiz/${taskId}/results`, {
      day_index: dayIndex,
      score,
      total_questions: questions?.length || 0,
    });
  };

  if (loading || !task) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-40 rounded-2xl" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-xl mx-auto px-4 py-8">

        {/* Header */}
        <button
          onClick={() => router.push(`/daily-quiz/${taskId}/path`)}
          className="flex items-center gap-1.5 text-sm font-bold text-[#7B8FB5] hover:text-[#27355B] transition-colors mb-5"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
          Back to Path
        </button>

        {/* Day banner */}
        <div className="bg-[#27355B] rounded-2xl p-4 mb-6 border-b-4 border-[#172140]">
          <p className="text-[#8FA4CC] text-[10px] font-extrabold uppercase tracking-widest">
            {task.title}
          </p>
          <h2 className="text-white text-lg font-extrabold mt-0.5">
            Day {dayIndex + 1}
          </h2>
          <p className="text-[#6A85AF] text-xs mt-0.5">{task.topic}</p>
        </div>

        {questions && questions.length > 0 ? (
          <div className="space-y-4">
            <QuizPlayView questions={questions} onComplete={handleComplete} />
            {completed && (
              <ButtonCustom
                onClick={() => router.push(`/daily-quiz/${taskId}/path`)}
                color="navy"
                size="lg"
                className="w-full"
              >
                ← Back to Path
              </ButtonCustom>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="text-5xl mb-4">😓</div>
            <p className="text-[#27355B] font-extrabold mb-1">Couldn't generate questions</p>
            <p className="text-[#7B8FB5] text-sm mb-6">Please check your connection and try again.</p>
            <ButtonCustom onClick={() => window.location.reload()} color="blue" size="md">
              Retry
            </ButtonCustom>
          </div>
        )}
      </div>
    </div>
  );
}
