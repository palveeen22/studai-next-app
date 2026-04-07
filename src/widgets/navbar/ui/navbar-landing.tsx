'use client';

import { useEffect, useState } from 'react';
import { ButtonCustom } from '@/shared/ui';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? '#1CB0F6' : 'rgba(255,255,255,0.8)',
        backdropFilter: scrolled ? 'none' : 'blur(12px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between relative">

        <div className={`${scrolled ? 'opacity-0' : 'opacity-100'} flex items-center gap-2.5`}>
          <span className="text-xl font-extrabold text-[#2D2D2D] tracking-tight">
            StudAI
          </span>
        </div>

        <div className={`${scrolled ? 'opacity-0' : 'opacity-100'} transition-all duration-300`}>
          <ButtonCustom size="sm" color="gold" href="/login">
            Let&lsquo;s try
          </ButtonCustom>
        </div>

        {scrolled && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-white font-semibold text-sm md:text-base animate-fade-in">
              “ Small steps every day = big results 🚀 ”
            </p>
          </div>
        )}

      </div>
    </nav>
  );
};