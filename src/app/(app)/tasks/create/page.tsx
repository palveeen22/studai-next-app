'use client';

import { useRouter } from 'next/navigation';
import { ScreenContainer } from '@/shared/ui/custom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/components';
import { useSubjectsQuery } from '@/features/subjects/model/use-subjects';
import { useCreateTaskMutation } from '@/features/tasks/model/useTasks';
import { TaskForm } from '@/features/tasks/ui/TaskList';

export default function CreateTaskPage() {
  const router = useRouter();
  const { data: subjects, isLoading } = useSubjectsQuery();
  const createMutation = useCreateTaskMutation();

  if (isLoading) {
    return (
      <ScreenContainer title="Create Task">
        <Skeleton className="h-80 rounded-xl" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer title="Create Task" description="Add a new task to your study plan">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            subjects={subjects || []}
            onSubmit={(payload) => {
              createMutation.mutate(payload, {
                onSuccess: () => router.push(`/tasks/${payload.subject_id}`),
              });
            }}
            isLoading={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </ScreenContainer>
  );
}
