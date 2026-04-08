'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Subject, SubjectColor, CreateSubjectPayload } from '@/shared/types';
import { COLORS, SUBJECT_COLORS, SUBJECT_EMOJIS } from '@/shared/constants';
import { cn } from '@/shared/lib/utils';
import { ButtonCustom } from '@/shared/ui/buttonCustom';
import { Dialog } from '@/shared/ui/components';

// ─── SubjectCard ──────────────────────────────────────────────────────────────

interface SubjectCardProps {
  subject: Subject;
  taskCount: number;
  completedCount: number;
  onDelete: (id: string) => void;
}

export function SubjectCard({ subject, taskCount, completedCount, onDelete }: SubjectCardProps) {
  const colorSet = COLORS.subjects[subject.color];
  const pct = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;
  const done = completedCount === taskCount && taskCount > 0;

  return (
    <motion.div whileHover={{ y: -3 }} whileTap={{ y: 1 }} className="group relative">
      <Link href={`/tasks/${subject.id}`}>
        <div
          className="rounded-2xl border-2 p-5 transition-all"
          style={{
            borderColor: colorSet.fg + '40',
            backgroundColor: colorSet.bg,
            boxShadow: `0 4px 0 ${colorSet.fg}30`,
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-3xl leading-none">{subject.icon}</span>
            <span
              className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ backgroundColor: colorSet.fg + '20', color: colorSet.text }}
            >
              {pct}%
            </span>
          </div>
          <h3 className="font-extrabold text-[#27355B] text-sm mb-0.5">{subject.name}</h3>
          <p className="text-xs font-medium mb-3" style={{ color: colorSet.text }}>
            {completedCount}/{taskCount} tasks done
          </p>
          <div className="h-2.5 rounded-full bg-white/60 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: colorSet.fg }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          {done && taskCount > 0 && (
            <p className="text-[10px] font-extrabold mt-2" style={{ color: colorSet.text }}>
              ✅ All done!
            </p>
          )}
        </div>
      </Link>
      {/* Delete */}
      <button
        onClick={(e) => { e.preventDefault(); onDelete(subject.id); }}
        className="absolute right-2.5 top-2.5 h-7 w-7 flex items-center justify-center rounded-xl bg-white/80 text-gray-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 shadow-sm"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}

// ─── CreateSubjectDialog ──────────────────────────────────────────────────────

interface CreateSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateSubjectPayload) => void;
  isLoading: boolean;
}

export function CreateSubjectDialog({ open, onOpenChange, onSubmit, isLoading }: CreateSubjectDialogProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📚');
  const [color, setColor] = useState<SubjectColor>('mint');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, icon, color });
    setName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="bg-white rounded-2xl p-6 shadow-2xl w-fullmx-4">
        <h2 className="text-lg font-extrabold text-[#27355B] mb-5">New Subject</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <p className="text-[10px] font-extrabold text-[#7B8FB5] uppercase tracking-widest mb-2">Name</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mathematics"
              required
              className="w-full h-12 rounded-xl border-2 border-[#E2E8F0] px-4 text-[#27355B] placeholder-[#B0BDD4] text-sm font-medium focus:outline-none focus:border-[#27355B] transition-colors"
            />
          </div>

          {/* Icon */}
          <div>
            <p className="text-[10px] font-extrabold text-[#7B8FB5] uppercase tracking-widest mb-2">Icon</p>
            <div className="flex flex-wrap gap-1.5">
              {SUBJECT_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all',
                    icon === emoji
                      ? 'bg-[#27355B] shadow-[0_3px_0_#172140] scale-95'
                      : 'bg-[#EEF2FA] hover:bg-[#E2E8F0]'
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <p className="text-[10px] font-extrabold text-[#7B8FB5] uppercase tracking-widest mb-2">Color</p>
            <div className="flex gap-2">
              {SUBJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn('h-8 w-8 rounded-full transition-all', color === c && 'ring-3 ring-offset-2 ring-[#27355B]')}
                  style={{ backgroundColor: COLORS.subjects[c].fg }}
                />
              ))}
            </div>
          </div>

          <ButtonCustom type="submit" color="navy" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating…' : 'Create Subject'}
          </ButtonCustom>
        </form>
      </div>
    </Dialog>
  );
}

// ─── SubjectGrid ──────────────────────────────────────────────────────────────

interface SubjectGridProps {
  subjects: Subject[];
  taskCounts: Record<string, { total: number; completed: number }>;
  onDelete: (id: string) => void;
  onCreateClick: () => void;
}

export function SubjectGrid({ subjects, taskCounts, onDelete, onCreateClick }: SubjectGridProps) {
  if (subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EEF2FA] mb-5">
          <span className="text-4xl">📚</span>
        </div>
        <h3 className="text-lg font-extrabold text-[#27355B] mb-2">No subjects yet</h3>
        <p className="text-[#7B8FB5] text-sm mb-6 max-w-xs">
          Create your first subject to start organizing your tasks.
        </p>
        <ButtonCustom onClick={onCreateClick} color="navy" size="md">
          New Subject
        </ButtonCustom>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject, i) => (
        <motion.div
          key={subject.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <SubjectCard
            subject={subject}
            taskCount={taskCounts[subject.id]?.total || 0}
            completedCount={taskCounts[subject.id]?.completed || 0}
            onDelete={onDelete}
          />
        </motion.div>
      ))}

      {/* Add new card */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: subjects.length * 0.05 }}
        whileHover={{ y: -3 }}
        onClick={onCreateClick}
        className="flex min-h-40 items-center justify-center rounded-2xl border-2 border-dashed border-[#D1D7E8] text-[#B0BDD4] transition-all hover:border-[#27355B] hover:text-[#27355B] hover:bg-[#EEF2FA]/50"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-3xl">+</span>
          <span className="text-xs font-extrabold uppercase tracking-wider">New Subject</span>
        </div>
      </motion.button>
    </div>
  );
}
