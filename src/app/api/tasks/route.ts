import { createServerClient } from '@/shared/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const subjectId = url.searchParams.get('subjectId');
  const today = url.searchParams.get('today');

  let query = supabase
    .from('tasks')
    .select('*, subjects(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (subjectId) {
    query = query.eq('subject_id', subjectId);
  }

  if (today === 'true') {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    query = query
      .gte('deadline', startOfDay.toISOString())
      .lte('deadline', endOfDay.toISOString());
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...body, user_id: user.id })
    .select('*, subjects(*)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
