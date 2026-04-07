import { createServerClient } from '@/shared/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch today's tasks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data: allTasks } = await supabase
    .from('tasks')
    .select('completed')
    .eq('user_id', user.id);

  const todayCompleted = allTasks?.filter((t) => t.completed).length || 0;
  const todayTotal = allTasks?.length || 0;

  // Fetch recent tasks
  const { data: recentTasks } = await supabase
    .from('tasks')
    .select('*, subjects(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch AI usage
  const todayStr = new Date().toISOString().split('T')[0];
  const { data: usage } = await supabase
    .from('ai_usage')
    .select('summaries_used, quizzes_used')
    .eq('user_id', user.id)
    .eq('date', todayStr)
    .single();

  // Fetch subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Calculate streak from daily quiz results
  const { data: quizResults } = await supabase
    .from('daily_quiz_results')
    .select('completed_at')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false });

  let streak = 0;
  if (quizResults && quizResults.length > 0) {
    const dates = new Set(
      quizResults.map((r) => new Date(r.completed_at).toISOString().split('T')[0])
    );
    const checkDate = new Date();
    while (dates.has(checkDate.toISOString().split('T')[0])) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  return NextResponse.json({
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: profile?.name || 'Student',
        avatar_url: profile?.avatar_url || null,
        created_at: profile?.created_at || user.created_at,
      },
      streak,
      todayTasks: { completed: todayCompleted, total: todayTotal },
      aiUsage: {
        summaries_used: usage?.summaries_used || 0,
        quizzes_used: usage?.quizzes_used || 0,
      },
      recentTasks: recentTasks || [],
      subscription: subscription || { tier: 'free', is_active: true },
    },
  });
}
