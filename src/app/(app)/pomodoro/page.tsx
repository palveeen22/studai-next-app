'use client';

import { PomodoroTimer } from '@/features/pomodoro/ui/PomodoroTimer';

export default function PomodoroPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#27355B]">Pomodoro</h1>
          <p className="text-sm text-[#7B8FB5] mt-0.5 font-medium">Stay focused with timed study sessions</p>
        </div>
        <div className="bg-white rounded-2xl border-2 border-[#E8ECF4] shadow-[0_4px_0_#D1D7E8] p-8 flex justify-center">
          <PomodoroTimer />
        </div>
      </div>
    </div>
  );
}
