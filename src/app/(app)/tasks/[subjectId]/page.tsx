'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { ScreenContainer } from '@/shared/ui/custom';
import { Skeleton } from '@/shared/ui/components';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useTasksQuery, useToggleTaskMutation, useDeleteTaskMutation, useCreateTaskMutation } from '@/features/tasks/model/useTasks';
import { useSubjectsQuery } from '@/features/subjects/model/use-subjects';
import { TaskList, TaskForm } from '@/features/tasks/ui/TaskList';

export default function SubjectTasksPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [showForm, setShowForm] = useState(false);

  const { data: tasks, isLoading } = useTasksQuery(subjectId);
  const { data: subjects } = useSubjectsQuery();
  const toggleMutation = useToggleTaskMutation();
  const deleteMutation = useDeleteTaskMutation();
  const createMutation = useCreateTaskMutation();

  const subject = subjects?.find((s) => s.id === subjectId);

  if (isLoading) {
    return (
      <ScreenContainer>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      title={subject ? `${subject.icon} ${subject.name}` : 'Tasks'}
      description={`${tasks?.length || 0} tasks`}
      action={
        <Button variant="accent" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      }
    >
      {showForm && subjects && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm
              subjects={subjects}
              defaultSubjectId={subjectId}
              onSubmit={(payload) => {
                createMutation.mutate(payload, { onSuccess: () => setShowForm(false) });
              }}
              isLoading={createMutation.isPending}
            />
          </CardContent>
        </Card>
      )}

      <TaskList
        tasks={tasks || []}
        onToggle={(id) => toggleMutation.mutate(id)}
        onDelete={(id) => deleteMutation.mutate(id)}
        emptyMessage="No tasks in this subject"
      />
    </ScreenContainer>
  );
}
