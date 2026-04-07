import { createServerClient } from '@/shared/supabase/server';
import { NextResponse } from 'next/server';
import { generateQuizFromText } from '@/shared/api/gemini';
import { FREE_TIER_LIMITS } from '@/shared/constants';

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check usage limits
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('tier')
    .eq('user_id', user.id)
    .single();

  if (!subscription || subscription.tier === 'free') {
    const today = new Date().toISOString().split('T')[0];
    const { data: usage } = await supabase
      .from('ai_usage')
      .select('quizzes_used')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (usage && usage.quizzes_used >= FREE_TIER_LIMITS.quizzesPerDay) {
      return NextResponse.json(
        { error: 'Daily quiz limit reached. Upgrade to Premium for unlimited access.' },
        { status: 429 }
      );
    }
  }

  const { text, count = 10, goal = 'practice' } = await req.json();
  if (!text || text.trim().length < 50) {
    return NextResponse.json(
      { error: 'Please provide at least 50 characters of text.' },
      { status: 400 }
    );
  }

  try {
    const questions = await generateQuizFromText(text, count, goal);

    // Save quiz
    const { data: quiz, error: saveError } = await supabase
      .from('ai_quizzes')
      .insert({
        user_id: user.id,
        title: `Quiz — ${new Date().toLocaleDateString()}`,
        questions,
      })
      .select()
      .single();

    if (saveError) throw saveError;

    // Update usage
    const today = new Date().toISOString().split('T')[0];
    try {
      await supabase
        .from('ai_usage')
        .upsert(
          { user_id: user.id, date: today, quizzes_used: 1 },
          { onConflict: 'user_id,date' }
        );
    } catch { /* ignore usage tracking errors */ }

    return NextResponse.json({ data: { questions: quiz.questions, title: quiz.title } });
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz. Please try again.' },
      { status: 500 }
    );
  }
}
