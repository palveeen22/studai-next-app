import { createServerClient } from '@/shared/supabase/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  // Get current state
  const { data: task } = await supabase
    .from('tasks')
    .select('completed')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  const { data, error } = await supabase
    .from('tasks')
    .update({ completed: !task.completed })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*, subjects(*)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
