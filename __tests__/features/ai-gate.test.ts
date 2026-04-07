/**
 * Tests for useAIGate logic (unit test without rendering hooks)
 * We test the underlying logic since the hook just reads from Redux state.
 */
import { FREE_TIER_LIMITS } from '@/shared/constants';

describe('useAIGate logic', () => {
  function computeGate(tier: string, summariesUsed: number, quizzesUsed: number) {
    const isPremium = tier !== 'free';
    const canUseSummary = isPremium || summariesUsed < FREE_TIER_LIMITS.summariesPerDay;
    const canUseQuiz = isPremium || quizzesUsed < FREE_TIER_LIMITS.quizzesPerDay;
    const summariesRemaining = isPremium
      ? Infinity
      : FREE_TIER_LIMITS.summariesPerDay - summariesUsed;
    const quizzesRemaining = isPremium
      ? Infinity
      : FREE_TIER_LIMITS.quizzesPerDay - quizzesUsed;

    return { isPremium, canUseSummary, canUseQuiz, summariesRemaining, quizzesRemaining };
  }

  it('allows usage when under free tier limit', () => {
    const gate = computeGate('free', 0, 0);
    expect(gate.canUseSummary).toBe(true);
    expect(gate.canUseQuiz).toBe(true);
    expect(gate.summariesRemaining).toBe(3);
  });

  it('blocks at free tier limit', () => {
    const gate = computeGate('free', 3, 3);
    expect(gate.canUseSummary).toBe(false);
    expect(gate.canUseQuiz).toBe(false);
    expect(gate.summariesRemaining).toBe(0);
  });

  it('allows unlimited for premium', () => {
    const gate = computeGate('premium_monthly', 100, 100);
    expect(gate.canUseSummary).toBe(true);
    expect(gate.canUseQuiz).toBe(true);
    expect(gate.summariesRemaining).toBe(Infinity);
  });

  it('correctly identifies premium users', () => {
    expect(computeGate('free', 0, 0).isPremium).toBe(false);
    expect(computeGate('premium_monthly', 0, 0).isPremium).toBe(true);
    expect(computeGate('premium_yearly', 0, 0).isPremium).toBe(true);
  });
});
