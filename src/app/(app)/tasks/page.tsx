'use client';

import { useState } from 'react';
import { Skeleton } from '@/shared/ui/components';
import { ButtonCustom } from '@/shared/ui/buttonCustom';
import { useSubjectsQuery, useCreateSubjectMutation, useDeleteSubjectMutation } from '@/features/subjects/model/use-subjects';
import { useTasksQuery } from '@/features/tasks/model/useTasks';
import { SubjectGrid, CreateSubjectDialog } from '@/features/subjects/ui/SubjectGrid';

export default function TasksPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: subjects, isLoading: subjectsLoading } = useSubjectsQuery();
  const { data: tasks } = useTasksQuery();
  const createSubject = useCreateSubjectMutation();
  const deleteSubject = useDeleteSubjectMutation();

  const taskCounts: Record<string, { total: number; completed: number }> = {};
  tasks?.forEach((t) => {
    if (!taskCounts[t.subject_id]) taskCounts[t.subject_id] = { total: 0, completed: 0 };
    taskCounts[t.subject_id].total += 1;
    if (t.completed) taskCounts[t.subject_id].completed += 1;
  });

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-[#27355B]">Subjects</h1>
            <p className="text-sm text-[#7B8FB5] mt-0.5 font-medium">Organize your tasks by subject</p>
          </div>
          <ButtonCustom onClick={() => setDialogOpen(true)} color="navy" size="sm">
            + New Subject
          </ButtonCustom>
        </div>

        {subjectsLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
          </div>
        ) : (
          <SubjectGrid
            subjects={subjects || []}
            taskCounts={taskCounts}
            onDelete={(id) => deleteSubject.mutate(id)}
            onCreateClick={() => setDialogOpen(true)}
          />
        )}

        <CreateSubjectDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={(payload) => createSubject.mutate(payload)}
          isLoading={createSubject.isPending}
        />
      </div>
    </div>
  );
}
