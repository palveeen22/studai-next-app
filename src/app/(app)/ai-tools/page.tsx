'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAIGate } from '@/features/subscription/hooks/useAIGate';
import { FREE_TIER_LIMITS } from '@/shared/constants';

const tools = [
  {
    title: 'AI Summary',
    description: 'Paste your study material and get a clean, structured summary instantly.',
    emoji: '📄',
    href: '/ai-tools/summary',
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#F5C542]/40',
    shadow: '#FDE68A',
    badge: 'bg-[#F5C542] text-[#27355B]',
    usageKey: 'summaries' as const,
  },
  {
    title: 'AI Quiz',
    description: 'Generate multiple-choice quizzes from your notes to test your knowledge.',
    emoji: '🧠',
    href: '/ai-tools/quiz',
    bg: 'bg-[#EFF6FF]',
    border: 'border-[#1CB0F6]/30',
    shadow: '#BFDBFE',
    badge: 'bg-[#1CB0F6] text-white',
    usageKey: 'quizzes' as const,
  },
];

export default function AIToolsPage() {
  const { isPremium, summariesRemaining, quizzesRemaining } = useAIGate();

  const remaining = { summaries: summariesRemaining, quizzes: quizzesRemaining };
  const limits = { summaries: FREE_TIER_LIMITS.summariesPerDay, quizzes: FREE_TIER_LIMITS.quizzesPerDay };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#27355B]">AI Tools</h1>
          <p className="text-sm text-[#7B8FB5] mt-0.5 font-medium">Supercharge your studying with AI</p>
        </div>

        {/* Premium badge */}
        {isPremium && (
          <div className="flex items-center gap-3 bg-[#27355B] rounded-2xl p-4 mb-6 border-b-4 border-[#172140]">
            <span className="text-2xl">✨</span>
            <div>
              <p className="text-white font-extrabold text-sm">Premium — Unlimited AI</p>
              <p className="text-[#8FA4CC] text-xs">No daily limits on any tools</p>
            </div>
            <span className="ml-auto text-xs font-extrabold bg-[#F5C542] text-[#27355B] px-3 py-1 rounded-full shadow-[0_2px_0_#CFA830]">
              PRO
            </span>
          </div>
        )}

        {/* Tool cards */}
        <div className="space-y-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2 }}
            >
              <Link href={tool.href}>
                <div
                  className={`rounded-2xl border-2 p-5 ${tool.bg} ${tool.border} transition-all`}
                  style={{ boxShadow: `0 4px 0 ${tool.shadow}` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm text-3xl shrink-0">
                      {tool.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-extrabold text-[#27355B] text-base">{tool.title}</h3>
                        {!isPremium && (
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${tool.badge}`}>
                            {remaining[tool.usageKey]}/{limits[tool.usageKey]} left
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#7B8FB5] leading-relaxed">{tool.description}</p>
                    </div>
                    <svg className="h-5 w-5 text-[#C5CEDD] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                      <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                    </svg>
                  </div>

                  {/* Usage bar (free tier only) */}
                  {!isPremium && (
                    <div className="mt-4">
                      <div className="h-2 rounded-full bg-white/70 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${tool.usageKey === 'summaries' ? 'bg-[#F5C542]' : 'bg-[#1CB0F6]'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${((limits[tool.usageKey] - remaining[tool.usageKey]) / limits[tool.usageKey]) * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
