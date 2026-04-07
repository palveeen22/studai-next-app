import { authSlice, setUser, clearUser, setLoading, setError } from '@/features/auth/auth-slice';

const reducer = authSlice.reducer;

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const mockUser = {
  id: '123',
  email: 'test@example.com',
  name: 'Test User',
  avatar_url: null,
  created_at: '2025-01-01',
};

describe('authSlice', () => {
  it('has correct initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('setUser sets user and authenticates', () => {
    const state = reducer(initialState, setUser(mockUser));
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('clearUser resets auth state', () => {
    const authed = reducer(initialState, setUser(mockUser));
    const state = reducer(authed, clearUser());
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('setLoading updates loading flag', () => {
    const state = reducer(initialState, setLoading(false));
    expect(state.isLoading).toBe(false);
  });

  it('setError sets error and stops loading', () => {
    const state = reducer(initialState, setError('Login failed'));
    expect(state.error).toBe('Login failed');
    expect(state.isLoading).toBe(false);
  });
});
