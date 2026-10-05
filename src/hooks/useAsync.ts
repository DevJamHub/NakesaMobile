import { useCallback, useEffect, useRef, useState } from 'react';

import { friendlyError } from '@/lib/errors';

type State<T> = { data: T | undefined; error: string | null; loading: boolean; refreshing: boolean };

/**
 * Loads data for a screen with loading / error / refresh states.
 * `key` reloads the data whenever it changes (e.g. the id in the route).
 * `enabled: false` waits (e.g. until the user has picked something).
 */
export function useAsync<T>(load: () => Promise<T>, key: string, enabled = true) {
  const [state, setState] = useState<State<T>>({ data: undefined, error: null, loading: enabled, refreshing: false });
  const loadRef = useRef(load);
  loadRef.current = load;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const latest = useRef(0);

  const run = useCallback(async (mode: 'load' | 'refresh' | 'silent') => {
    // Still waiting (e.g. for a choice): `load` may need data that is not there yet.
    if (!enabledRef.current) return;
    const call = ++latest.current;
    setState((s) => ({
      data: mode === 'load' ? undefined : s.data,
      error: mode === 'load' ? null : s.error,
      loading: mode === 'load' ? true : s.loading,
      refreshing: mode === 'refresh' ? true : s.refreshing,
    }));
    try {
      const data = await loadRef.current();
      if (call === latest.current) setState({ data, error: null, loading: false, refreshing: false });
    } catch (error) {
      if (call === latest.current) {
        setState((s) => ({ ...s, error: friendlyError(error), loading: false, refreshing: false }));
      }
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      run('load');
    } else {
      latest.current++; // a request still on its way belongs to the old input
      setState({ data: undefined, error: null, loading: false, refreshing: false });
    }
  }, [key, enabled, run]);

  return {
    ...state,
    /** Load again from scratch (after an error). */
    reload: useCallback(() => run('load'), [run]),
    /** Pull-to-refresh: keeps the current data on screen. */
    refresh: useCallback(() => run('refresh'), [run]),
    /** Quiet update, e.g. when a tab comes back into view. */
    revalidate: useCallback(() => run('silent'), [run]),
    setData: useCallback((data: T) => setState((s) => ({ ...s, data })), []),
  };
}
