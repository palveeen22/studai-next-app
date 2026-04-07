import {
  dailyQuizSlice,
  setTasks,
  addTask,
  updateTaskStreak,
  cacheQuestions,
  archiveTask,
} from '@/features/daily-quiz/daily-quiz-slice';
import type { DailyQuizTask } from '@/shared/types';

const reducer = dailyQuizSlice.reducer;

const mockTask: DailyQuizTask = {
  id: 'task-1',
  user_id: 'user-1',
  title: 'React Hooks',
  topic: 'useState, useEffect',
  duration: 14,
  questions_per_day: 5,
  preparation_goal: 'exam',
  current_streak: 3,
  longest_streak: 5,
  is_archived: false,
  created_at: '2025-01-01',
};

describe('dailyQuizSlice', () => {
  it('has correct initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state.tasks).toEqual([]);
    expect(state.questionCache).toEqual({});
    expect(state.isGenerating).toBe(false);
  });

  it('setTasks replaces all tasks', () => {
    const state = reducer(undefined, setTasks([mockTask]));
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].id).toBe('task-1');
  });

  it('addTask appends a task', () => {
    let state = reducer(undefined, setTasks([mockTask]));
    const newTask = { ...mockTask, id: 'task-2', title: 'CSS Grid' };
    state = reducer(state, addTask(newTask));
    expect(state.tasks).toHaveLength(2);
  });

  it('updateTaskStreak updates current and longest', () => {
    let state = reducer(undefined, setTasks([mockTask]));
    state = reducer(state, updateTaskStreak({ taskId: 'task-1', streak: 6 }));
    expect(state.tasks[0].current_streak).toBe(6);
    expect(state.tasks[0].longest_streak).toBe(6); // 6 > 5
  });

  it('updateTaskStreak does not lower longest_streak', () => {
    let state = reducer(undefined, setTasks([mockTask]));
    state = reducer(state, updateTaskStreak({ taskId: 'task-1', streak: 2 }));
    expect(state.tasks[0].current_streak).toBe(2);
    expect(state.tasks[0].longest_streak).toBe(5); // stays at 5
  });

  it('cacheQuestions stores questions by taskId and dayIndex', () => {
    const questions = [{ question: 'Q?', options: ['A', 'B', 'C', 'D'], correctIndex: 0, explanation: 'test' }];
    const state = reducer(undefined, cacheQuestions({ taskId: 'task-1', dayIndex: 0, questions }));
    expect(state.questionCache['task-1'][0]).toEqual(questions);
  });

  it('archiveTask sets is_archived to true', () => {
    let state = reducer(undefined, setTasks([mockTask]));
    state = reducer(state, archiveTask('task-1'));
    expect(state.tasks[0].is_archived).toBe(true);
  });
});
