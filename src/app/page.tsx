import { redirect } from 'next/navigation';
import { createServerClient } from '@/shared/supabase/server';
import { LandingPage } from '@/features/landing';

export default async function RootPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return <LandingPage />;
}
