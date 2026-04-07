import { createServerClient } from '@/shared/supabase/server';
import { NextResponse } from 'next/server';
import { generateSummaryFromText } from '@/shared/api/gemini';
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
      .select('summaries_used')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (usage && usage.summaries_used >= FREE_TIER_LIMITS.summariesPerDay) {
      return NextResponse.json(
        { error: 'Daily summary limit reached. Upgrade to Premium for unlimited access.' },
        { status: 429 }
      );
    }
  }

  const { text } = await req.json();
  if (!text || text.trim().length < 50) {
    return NextResponse.json(
      { error: 'Please provide at least 50 characters of text.' },
      { status: 400 }
    );
  }

  try {
    const bullets = await generateSummaryFromText(text);

    // Save summary
    const { data: summary, error: saveError } = await supabase
      .from('ai_summaries')
      .insert({ user_id: user.id, original_text: text, bullets })
      .select()
      .single();

    if (saveError) throw saveError;

    // Update usage
    const today = new Date().toISOString().split('T')[0];
    try {
      await supabase
        .from('ai_usage')
        .upsert(
          { user_id: user.id, date: today, summaries_used: 1 },
          { onConflict: 'user_id,date' }
        );
    } catch { /* ignore usage tracking errors */ }

    return NextResponse.json({ data: summary });
  } catch (error) {
    console.error('Summary generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary. Please try again.' },
      { status: 500 }
    );
  }
}
