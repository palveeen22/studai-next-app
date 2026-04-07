'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTutorChat } from '@/features/tutor/model/useTutorChat';
import { MessageBubble, ChatInput } from '@/features/tutor/ui/ChatComponents';

const SUGGESTION_PROMPTS = [
  'Explain photosynthesis simply',
  'Help me with calculus',
  'Quiz me on World War II',
  'What is machine learning?',
];

export default function TutorPage() {
  const { messages, sendMessage, isStreaming, clearHistory } = useTutorChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col lg:h-screen bg-[#fafafa]">

      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-[#E8ECF4] bg-white px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FA] text-xl shadow-[0_3px_0_#D1D7E8]">
            🤖
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-[#27355B]">AI Tutor</h1>
            <p className="text-xs text-[#7B8FB5] font-medium">
              {isStreaming ? (
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#58CC02] animate-pulse inline-block" />
                  Typing…
                </span>
              ) : 'Ask me anything about your studies'}
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 text-xs font-extrabold text-[#7B8FB5] hover:text-red-500 transition-colors px-3 py-1.5 rounded-xl hover:bg-red-50"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto px-4 py-6">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex h-full flex-col items-center justify-center text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EEF2FA] shadow-[0_5px_0_#D1D7E8] mb-5 text-4xl">
              🤖
            </div>
            <h2 className="text-lg font-extrabold text-[#27355B] mb-1">Your AI Study Buddy</h2>
            <p className="text-sm text-[#7B8FB5] max-w-xs leading-relaxed mb-6">
              I can explain complex topics, help with analogies, and quiz you on what you've learned.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTION_PROMPTS.map((prompt) => (
                <motion.button
                  key={prompt}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 1 }}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-2xl border-2 border-[#E2E8F0] bg-white px-4 py-2 text-xs font-extrabold text-[#27355B] transition-all hover:border-[#27355B] hover:bg-[#EEF2FA] shadow-[0_2px_0_#E2E8F0]"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                role={msg.role}
                content={msg.content}
                isStreaming={isStreaming && i === messages.length - 1 && msg.role === 'assistant'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="max-w-2xl w-full mx-auto">
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </div>
    </div>
  );
}
