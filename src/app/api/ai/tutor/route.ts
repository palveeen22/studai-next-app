import { createServerClient } from '@/shared/supabase/server';
import { NextResponse } from 'next/server';
import { streamTutorReply } from '@/shared/api/open-ai';

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { messages } = await req.json();

  if (!messages || messages.length === 0) {
    return NextResponse.json(
      { error: 'No messages provided' },
      { status: 400 }
    );
  }

  try {
    const stream = await streamTutorReply(messages);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Tutor stream error:", error);

    return NextResponse.json(
      { error: "Failed to start tutor session." },
      { status: 500 }
    );
  }
}