'use client';

import { Skeleton } from '@/shared/ui/components';
import { useProfile } from '@/features/profile/model/useProfile';
import { ProfileView } from '@/features/profile/ui/ProfileView';

export default function ProfilePage() {
  const { data, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="max-w-md mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-8 w-32 rounded-xl" />
          <div className="flex flex-col items-center gap-3 bg-white rounded-2xl p-8">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-5 w-36 rounded-xl" />
            <Skeleton className="h-4 w-48 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-2xl" />
          </div>
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#27355B]">Profile</h1>
          <p className="text-sm text-[#7B8FB5] mt-0.5 font-medium">Your account & settings</p>
        </div>
        <ProfileView user={data.user} subscription={data.subscription} />
      </div>
    </div>
  );
}
