import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

/**
 * Quietly reloads a screen's data when the patient comes back to it, e.g. after booking or
 * cancelling on another screen. The first visit is skipped: the screen has just loaded.
 */
export function useRevalidateOnFocus(revalidate: () => void) {
  const revalidateRef = useRef(revalidate);
  revalidateRef.current = revalidate;
  const visited = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (visited.current) revalidateRef.current();
      visited.current = true;
    }, []),
  );
}
