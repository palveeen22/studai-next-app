'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ButtonCustom } from '@/shared/ui/buttonCustom';
import { DAILY_QUIZ } from '@/shared/constants';
import { useCreateDailyQuizMutation } from '@/features/daily-quiz/model/useDailyQuizTasks';
import { cn } from '@/shared/lib/utils';
import type { PreparationGoal } from '@/shared/types';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-extrabold text-[#7B8FB5] uppercase tracking-widest mb-2">
      {children}
    </p>
  );
}

function DarkInput(props: React.ComponentProps<'input'>) {
  return (
    <input
      {...props}
      className="w-full h-12 rounded-xl border-2 border-[#E2E8F0] bg-white px-4 text-[#27355B] placeholder-[#B0BDD4] text-sm font-medium focus:outline-none focus:border-[#27355B] transition-colors"
    />
  );
}

export default function CreateDailyQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(14);
  const [questionsPerDay, setQuestionsPerDay] = useState(5);
  const [goal, setGoal] = useState<PreparationGoal>('practice');

  const createMutation = useCreateDailyQuizMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { title, topic, duration, questions_per_day: questionsPerDay, preparation_goal: goal },
      { onSuccess: () => router.push('/daily-quiz') }
    );
  };

  const GOAL_ICONS: Record<string, string> = {
    interview: '🎯', exam: '📝', test: '✅', practice: '💪',
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Header */}
        <button
          onClick={() => router.push('/daily-quiz')}
          className="flex items-center gap-1.5 text-sm font-bold text-[#7B8FB5] hover:text-[#27355B] transition-colors mb-6"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
            <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
          Daily Quiz
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-[#27355B]">New Challenge</h1>
          <p className="text-sm text-[#7B8FB5] mt-0.5">Set up your daily quiz routine</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <SectionLabel>Challenge Title</SectionLabel>
            <DarkInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Master React Hooks"
              required
            />
          </div>

          {/* Topic */}
          <div>
            <SectionLabel>Topic</SectionLabel>
            <DarkInput
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., React Hooks, useState, useEffect…"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <SectionLabel>Duration</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {DAILY_QUIZ.durations.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={cn(
                    'rounded-xl border-2 px-4 py-2 text-sm font-extrabold transition-all',
                    duration === d
                      ? 'border-[#27355B] bg-[#27355B] text-white shadow-[0_3px_0_#172140]'
                      : 'border-[#E2E8F0] bg-white text-[#7B8FB5] hover:border-[#27355B]/40'
                  )}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {/* Questions per day */}
          <div>
            <SectionLabel>Questions per Day</SectionLabel>
            <div className="flex gap-2">
              {DAILY_QUIZ.questionsPerDay.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuestionsPerDay(q)}
                  className={cn(
                    'flex-1 rounded-xl border-2 py-3 text-sm font-extrabold transition-all',
                    questionsPerDay === q
                      ? 'border-[#1CB0F6] bg-[#1CB0F6] text-white shadow-[0_3px_0_#1899D6]'
                      : 'border-[#E2E8F0] bg-white text-[#7B8FB5] hover:border-[#1CB0F6]/40'
                  )}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div>
            <SectionLabel>Preparation Goal</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {DAILY_QUIZ.preparationGoals.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGoal(g.value as PreparationGoal)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-xl border-2 p-3.5 text-sm font-extrabold transition-all',
                    goal === g.value
                      ? 'border-[#F5C542] bg-[#FFFBEB] text-[#27355B] shadow-[0_3px_0_#CFA830]'
                      : 'border-[#E2E8F0] bg-white text-[#7B8FB5] hover:border-[#F5C542]/50'
                  )}
                >
                  <span className="text-lg">{GOAL_ICONS[g.value]}</span>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <ButtonCustom
              type="submit"
              color="green"
              size="lg"
              className="w-full"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Start Challenge
            </ButtonCustom>
          </div>
        </form>
      </div>
    </div>
  );
}
