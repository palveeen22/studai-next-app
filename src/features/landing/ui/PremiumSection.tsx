import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const PremiumSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-widest mb-3 text-[#9B59B6]">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2D2D2D]">
            Start free, upgrade when you&apos;re ready
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border-2 border-gray-200 p-7 shadow-[0_5px_0_#D1D5DB]"
          >
            <h3 className="text-lg font-bold text-[#2D2D2D]">Free</h3>
            <p className="text-3xl font-extrabold text-[#2D2D2D] mt-2">$0</p>
            <p className="text-sm text-gray-400 mt-1">Forever free</p>
            <ul className="mt-6 space-y-3">
              {[
                'Unlimited subjects & tasks',
                '3 AI summaries / day',
                '3 AI quizzes / day',
                'AI Tutor chat',
                'Daily quiz streaks',
                'Pomodoro timer',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-[#2ECC71] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="block mt-8 text-center font-bold text-[#2D2D2D] bg-gray-100 hover:bg-gray-200 py-3 rounded-xl transition-colors"
            >
              Get Started Free
            </Link>
          </motion.div>

          {/* Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border-2 border-[#F5C542] bg-[#FFFDF5] p-7 relative shadow-[0_5px_0_#CFA830]"
          >
            <span className="absolute -top-3 right-6 bg-[#F5C542] text-[#2D2D2D] text-xs font-bold px-3 py-1 rounded-full shadow-[0_5px_0_#CFA830]">
              POPULAR
            </span>
            <h3 className="text-lg font-bold text-[#2D2D2D]">Premium</h3>
            <p className="text-3xl font-extrabold text-[#2D2D2D] mt-2">
              $9.99<span className="text-base font-normal text-gray-400">/mo</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Cancel anytime</p>
            <ul className="mt-6 space-y-3">
              {[
                'Everything in Free',
                'Unlimited AI summaries',
                'Unlimited AI quizzes',
                'Priority AI responses',
                'Advanced analytics',
                'Export study data',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-[#F5C542] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="block mt-8 text-center font-bold text-[#2D2D2D] bg-[#F5C542] hover:bg-[#e8b83a] py-3 rounded-xl transition-colors shadow-md shadow-amber-200/40"
            >
              Start Premium
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
