'use client';

import { isOverdue, formatDate, cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/components';
import { motion } from 'framer-motion';
import { Check, Clock, AlertTriangle } from 'lucide-react';

interface TaskStatusBadgeProps {
  completed: boolean;
  deadline: string | null;
}

export function TaskStatusBadge({ completed, deadline }: TaskStatusBadgeProps) {
  if (completed) {
    return (
      <Badge variant="secondary" className="gap-1 bg-green-50 text-green-700">
        <Check className="h-3 w-3" />
        Done
      </Badge>
    );
  }
  if (isOverdue(deadline)) {
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="h-3 w-3" />
        Overdue
      </Badge>
    );
  }
  if (deadline) {
    return (
      <Badge variant="outline" className="gap-1">
        <Clock className="h-3 w-3" />
        {formatDate(deadline)}
      </Badge>
    );
  }
  return null;
}

interface TaskCheckboxProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export function TaskCheckbox({ checked, onChange, disabled }: TaskCheckboxProps) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200',
        checked
          ? 'border-[#F5C542] bg-[#F5C542]'
          : 'border-gray-300 group-hover:border-[#F5C542]/50'
      )}
    >
      {checked && (
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
          viewBox="0 0 24 24"
          className="h-3 w-3"
        >
          <motion.path
            d="M5 12l5 5L20 7"
            fill="none"
            stroke="#2D2D2D"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.svg>
      )}
    </button>
  );
}
