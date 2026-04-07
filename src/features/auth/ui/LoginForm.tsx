'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useLogin } from '../model/useLogin';

// ─── Inline brand icons ────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="#1877F2"
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.932-1.956 1.889v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
      />
    </svg>
  );
}

// ─── Dark input ────────────────────────────────────────────────────────────────

interface DarkInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rightSlot?: React.ReactNode;
}

function DarkInput({ rightSlot, ...props }: DarkInputProps) {
  return (
    <div className="relative">
      <input
        className="w-full h-[54px] rounded-xl bg-[#1f2d35] border border-[#2d3e47] px-4 text-white placeholder-[#4a6275] text-base focus:outline-none focus:border-[#49c8f5] transition-colors pr-24"
        {...props}
      />
      {rightSlot && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightSlot}
        </div>
      )}
    </div>
  );
}

// ─── LoginForm ────────────────────────────────────────────────────────────────

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h1 className="text-white text-[28px] font-extrabold text-center mb-6">
        Log in
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <DarkInput
          type="email"
          placeholder="Email or username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <DarkInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="current-password"
          rightSlot={
            <Link
              href="/forgot-password"
              className="text-[11px] font-extrabold text-[#8a9eb0] hover:text-white tracking-wider uppercase transition-colors"
            >
              Forgot?
            </Link>
          }
        />

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-400 text-center pt-1"
          >
            {error}
          </motion.p>
        )}

        <div className="pt-1">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[54px] rounded-xl bg-[#1cb0f6] shadow-[0_4px_0_#0992cc] text-white text-sm font-extrabold uppercase tracking-widest hover:bg-[#2bbeff] active:shadow-none active:translate-y-[3px] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Log in
          </button>
        </div>
      </form>

      {/* OR divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-[#2d3e47]" />
        <span className="text-[#4a6275] text-sm font-bold">OR</span>
        <div className="flex-1 h-px bg-[#2d3e47]" />
      </div>

      {/* Social buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          className="flex-1 h-[50px] flex items-center justify-center gap-2.5 rounded-xl border-2 border-[#2d3e47] bg-transparent text-white text-xs font-extrabold uppercase tracking-wider hover:bg-white/5 transition-colors"
        >
          <GoogleIcon />
          Google
        </button>
        <button
          type="button"
          className="flex-1 h-[50px] flex items-center justify-center gap-2.5 rounded-xl border-2 border-[#2d3e47] bg-transparent text-white text-xs font-extrabold uppercase tracking-wider hover:bg-white/5 transition-colors"
        >
          <FacebookIcon />
          Facebook
        </button>
      </div>

      {/* Legal */}
      <p className="text-[#4a6275] text-xs text-center mt-6 leading-relaxed">
        By signing in to StudAI, you agree to our{' '}
        <Link href="/terms" className="text-[#6a8a9a] hover:text-white underline transition-colors">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-[#6a8a9a] hover:text-white underline transition-colors">
          Privacy Policy
        </Link>
        .
      </p>
    </motion.div>
  );
}
