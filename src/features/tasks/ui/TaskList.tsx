"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import type { Task, Subject, CreateTaskPayload } from "@/shared/types";
import { cn } from "@/shared/lib/utils";
import { TaskCheckbox, TaskStatusBadge } from "@/entities/task";
import { SubjectPill } from "@/entities/subject";
import { ButtonCustom } from "@/shared/ui/buttonCustom";
import { Textarea } from "@/shared/ui/components";

// ─── TaskItem ─────────────────────────────────────────────────────────────────

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  showSubject?: boolean;
}

export function TaskItem({
  task,
  onToggle,
  onDelete,
  showSubject = false,
}: TaskItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      onClick={() => onToggle(task.id)}
      className="group flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-[#E8ECF4] bg-white p-4 shadow-[0_3px_0_#D1D7E8] transition-all duration-200 hover:-translate-y-px hover:border-[#27355B]/30 hover:bg-[#F8FAFF] hover:shadow-[0_6px_0_#D1D7E8]"
    >
      {/* Checkbox (stop propagation biar tidak double toggle) */}
      <div onClick={(e) => e.stopPropagation()}>
        <TaskCheckbox
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-extrabold text-[#27355B] transition-colors",
            task.completed && "text-[#B0BDD4] line-through",
          )}
        >
          {task.title}
        </p>

        {task.description && (
          <p className="mt-0.5 truncate text-xs font-medium text-[#7B8FB5]">
            {task.description}
          </p>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {showSubject && task.subjects && (
            <SubjectPill
              name={task.subjects.name}
              icon={task.subjects.icon}
              color={task.subjects.color}
            />
          )}
          <TaskStatusBadge
            completed={task.completed}
            deadline={task.deadline}
          />
        </div>
      </div>

      {/* Delete Button (ONLY button interaction) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="rounded-xl p-2 text-[#C5CEDD] opacity-0 transition-all duration-200
                   hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
          />
        </svg>
      </button>
    </motion.div>
  );
}

// ─── TaskList ─────────────────────────────────────────────────────────────────

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  showSubject?: boolean;
  emptyMessage?: string;
}

export function TaskList({
  tasks,
  onToggle,
  onDelete,
  showSubject = false,
  emptyMessage = "No tasks yet",
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <span className="text-4xl mb-3">✅</span>
        <p className="font-extrabold text-[#27355B] text-sm mb-1">
          {emptyMessage}
        </p>
        <p className="text-xs text-[#7B8FB5]">Create a task to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            showSubject={showSubject}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── TaskForm ─────────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-extrabold text-[#7B8FB5] uppercase tracking-widest mb-2">
      {children}
    </p>
  );
}

function DarkInput(props: React.ComponentProps<"input">) {
  return (
    <input
      {...props}
      className="w-full h-12 rounded-xl border-2 border-[#E2E8F0] bg-white px-4 text-[#27355B] placeholder-[#B0BDD4] text-sm font-medium focus:outline-none focus:border-[#27355B] transition-colors"
    />
  );
}

interface TaskFormProps {
  subjects: Subject[];
  onSubmit: (payload: CreateTaskPayload) => void;
  isLoading: boolean;
  defaultSubjectId?: string;
}

export function TaskForm({
  subjects,
  onSubmit,
  isLoading,
  defaultSubjectId,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState(defaultSubjectId || "");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      subject_id: subjectId,
      title,
      description: description || undefined,
      deadline: deadline || undefined,
    });
    setTitle("");
    setDescription("");
    setDeadline("");
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <FieldLabel>Subject</FieldLabel>
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          required
          className="w-full h-12 rounded-xl border-2 border-[#E2E8F0] bg-white px-4 text-[#27355B] text-sm font-medium focus:outline-none focus:border-[#27355B] transition-colors"
        >
          <option value="">Select a subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.icon} {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <FieldLabel>Task Title</FieldLabel>
        <DarkInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Read Chapter 5"
          required
        />
      </div>

      <div>
        <FieldLabel>Description (optional)</FieldLabel>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add notes about this task…"
          rows={3}
          className="border-2 border-[#E2E8F0] rounded-xl focus-visible:ring-0 focus-visible:border-[#27355B] text-[#27355B] placeholder-[#B0BDD4] resize-none"
        />
      </div>

      <div>
        <FieldLabel>Deadline (optional)</FieldLabel>
        <div className="relative">
          {/* <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0BDD4]" /> */}
          <DarkInput
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ButtonCustom
        type="submit"
        color="navy"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Creating…" : "+ Create Task"}
      </ButtonCustom>
    </motion.form>
  );
}
