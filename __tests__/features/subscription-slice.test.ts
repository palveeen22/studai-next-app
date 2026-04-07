import {
  subscriptionSlice,
  setSubscription,
  setUsage,
  incrementSummaryUsage,
  incrementQuizUsage,
} from '@/features/subscription/subscription-slice';

const reducer = subscriptionSlice.reducer;

describe('subscriptionSlice', () => {
  it('has correct initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state.tier).toBe('free');
    expect(state.isActive).toBe(true);
    expect(state.summariesUsedToday).toBe(0);
    expect(state.quizzesUsedToday).toBe(0);
  });

  it('setSubscription updates tier', () => {
    const state = reducer(undefined, setSubscription({ tier: 'premium_monthly', isActive: true }));
    expect(state.tier).toBe('premium_monthly');
    expect(state.isActive).toBe(true);
  });

  it('setUsage sets both counters', () => {
    const state = reducer(undefined, setUsage({ summaries: 2, quizzes: 1 }));
    expect(state.summariesUsedToday).toBe(2);
    expect(state.quizzesUsedToday).toBe(1);
  });

  it('incrementSummaryUsage increments by 1', () => {
    let state = reducer(undefined, setUsage({ summaries: 1, quizzes: 0 }));
    state = reducer(state, incrementSummaryUsage());
    expect(state.summariesUsedToday).toBe(2);
  });

  it('incrementQuizUsage increments by 1', () => {
    let state = reducer(undefined, setUsage({ summaries: 0, quizzes: 2 }));
    state = reducer(state, incrementQuizUsage());
    expect(state.quizzesUsedToday).toBe(3);
  });
});
