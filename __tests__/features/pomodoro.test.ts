/**
 * Tests for Pomodoro timer logic
 */
import { POMODORO } from '@/shared/constants';

type Phase = 'focus' | 'shortBreak' | 'longBreak';

function getDuration(phase: Phase) {
  switch (phase) {
    case 'focus': return POMODORO.focusDuration;
    case 'shortBreak': return POMODORO.shortBreak;
    case 'longBreak': return POMODORO.longBreak;
  }
}

function getNextPhase(phase: Phase, sessionCount: number): { nextPhase: Phase; nextSessionCount: number } {
  if (phase === 'focus') {
    const next = sessionCount + 1;
    return {
      nextPhase: next % POMODORO.sessionsBeforeLongBreak === 0 ? 'longBreak' : 'shortBreak',
      nextSessionCount: next,
    };
  }
  return { nextPhase: 'focus', nextSessionCount: sessionCount };
}

describe('Pomodoro timer logic', () => {
  it('has correct durations', () => {
    expect(getDuration('focus')).toBe(25 * 60);
    expect(getDuration('shortBreak')).toBe(5 * 60);
    expect(getDuration('longBreak')).toBe(15 * 60);
  });

  it('transitions from focus to short break', () => {
    const result = getNextPhase('focus', 0);
    expect(result.nextPhase).toBe('shortBreak');
    expect(result.nextSessionCount).toBe(1);
  });

  it('transitions to long break after 4 focus sessions', () => {
    const result = getNextPhase('focus', 3);
    expect(result.nextPhase).toBe('longBreak');
    expect(result.nextSessionCount).toBe(4);
  });

  it('transitions from break back to focus', () => {
    const result = getNextPhase('shortBreak', 2);
    expect(result.nextPhase).toBe('focus');
    expect(result.nextSessionCount).toBe(2);
  });

  it('cycles correctly through full pomodoro', () => {
    let phase: Phase = 'focus';
    let sessions = 0;

    // 4 complete focus sessions
    for (let i = 0; i < 4; i++) {
      const result = getNextPhase(phase, sessions);
      phase = result.nextPhase;
      sessions = result.nextSessionCount;

      if (i < 3) {
        expect(phase).toBe('shortBreak');
      } else {
        expect(phase).toBe('longBreak');
      }

      // Complete break
      const breakResult = getNextPhase(phase, sessions);
      phase = breakResult.nextPhase;
      sessions = breakResult.nextSessionCount;
      expect(phase).toBe('focus');
    }

    expect(sessions).toBe(4);
  });
});
