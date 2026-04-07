'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/shared/supabase/client';
import { formatDate } from '@/shared/lib/utils';
import { UserAvatar } from '@/entities/user';
import { ButtonCustom } from '@/shared/ui/buttonCustom';
import type { User, Subscription } from '@/shared/types';

interface ProfileViewProps {
  user: User;
  subscription: Subscription;
}

const TIER_CONFIG = {
  free: { label: 'Free Plan', emoji: '🎒', bg: 'bg-[#EEF2FA]', text: 'text-[#27355B]', shadow: '#D1D7E8' },
  premium: { label: 'Premium', emoji: '👑', bg: 'bg-[#FFFBEB]', text: 'text-[#27355B]', shadow: '#FDE68A' },
};

// const STAT_ITEMS = [
//   { emoji: '📅', label: 'Member since' },
//   { emoji: '✉️', label: 'Email' },
// ];

export function ProfileView({ user, subscription }: ProfileViewProps) {
  const router = useRouter();
  const supabase = createClient();
  const tier = TIER_CONFIG[subscription.tier as keyof typeof TIER_CONFIG] ?? TIER_CONFIG.free;
  const isPremium = subscription.tier !== 'free';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Avatar card */}
      <div className="bg-white rounded-2xl border-2 border-[#E8ECF4] shadow-[0_4px_0_#D1D7E8] p-8 flex flex-col items-center">
        <div className="relative mb-4">
          <UserAvatar name={user.name} avatarUrl={user.avatar_url} size="lg" />
          {isPremium && (
            <span className="absolute -top-1 -right-1 text-lg leading-none">👑</span>
          )}
        </div>

        <h2 className="text-xl font-extrabold text-[#27355B]">{user.name}</h2>
        <p className="text-sm text-[#7B8FB5] font-medium mt-0.5">{user.email}</p>

        {/* Tier badge */}
        <div
          className={`mt-4 flex items-center gap-2 px-5 py-2 rounded-2xl border-2 ${tier.bg} ${tier.text}`}
          style={{ borderColor: tier.shadow + '80', boxShadow: `0 3px 0 ${tier.shadow}` }}
        >
          <span className="text-base leading-none">{tier.emoji}</span>
          <span className="text-xs font-extrabold uppercase tracking-wider">{tier.label}</span>
        </div>
      </div>

      {/* Info cards */}
      <div className="bg-white rounded-2xl border-2 border-[#E8ECF4] shadow-[0_4px_0_#D1D7E8] divide-y-2 divide-[#EEF2FA] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4">
          <span className="text-xl leading-none w-8 text-center">📅</span>
          <div>
            <p className="text-[10px] font-extrabold text-[#7B8FB5] uppercase tracking-widest">Member since</p>
            <p className="text-sm font-extrabold text-[#27355B] mt-0.5">{formatDate(user.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <span className="text-xl leading-none w-8 text-center">✉️</span>
          <div>
            <p className="text-[10px] font-extrabold text-[#7B8FB5] uppercase tracking-widest">Email</p>
            <p className="text-sm font-extrabold text-[#27355B] mt-0.5">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <span className="text-xl leading-none w-8 text-center">🔐</span>
          <div>
            <p className="text-[10px] font-extrabold text-[#7B8FB5] uppercase tracking-widest">Plan</p>
            <p className="text-sm font-extrabold text-[#27355B] mt-0.5">{tier.label}</p>
          </div>
        </div>
      </div>

      {/* Upgrade banner (free only) */}
      {!isPremium && (
        <div className="bg-[#27355B] rounded-2xl border-b-4 border-[#172140] p-5 flex items-center gap-4">
          <span className="text-3xl leading-none">🚀</span>
          <div className="flex-1 min-w-0">
            <p className="text-white font-extrabold text-sm">Upgrade to Premium</p>
            <p className="text-[#8FA4CC] text-xs mt-0.5">Unlock unlimited AI tools & more</p>
          </div>
          <ButtonCustom href="/subscription" color="gold" size="sm">
            Upgrade
          </ButtonCustom>
        </div>
      )}

      {/* Sign out */}
      <ButtonCustom onClick={handleLogout} color="red" size="lg" className="w-full">
        Sign Out
      </ButtonCustom>
    </motion.div>
  );
}
