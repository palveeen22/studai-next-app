import { createServerClient } from '@/shared/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { data, error } = await supabase
    .from('daily_quiz_results')
    .select('*')
    .eq('task_id', id)
    .eq('user_id', user.id)
    .order('day_index', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const { data, error } = await supabase
    .from('daily_quiz_results')
    .insert({
      task_id: id,
      user_id: user.id,
      day_index: body.day_index,
      score: body.score,
      total_questions: body.total_questions,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update streak on the task
  const { data: results } = await supabase
    .from('daily_quiz_results')
    .select('day_index')
    .eq('task_id', id)
    .eq('user_id', user.id)
    .order('day_index', { ascending: false });

  const streak = results?.length || 0;
  await supabase
    .from('daily_quiz_tasks')
    .update({
      current_streak: streak,
      longest_streak: streak, // simplified
    })
    .eq('id', id)
    .eq('user_id', user.id);

  return NextResponse.json({ data });
}
