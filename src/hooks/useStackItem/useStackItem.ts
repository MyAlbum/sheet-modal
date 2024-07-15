import { useCallback } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { FocusStack } from './store';
const stack = new FocusStack();

export function useStackItem(id: string) {
  const isActive = useSharedValue(false);

  const push = useCallback(() => {
    stack.push(id, isActive);
  }, [id, isActive]);

  const remove = useCallback(() => {
    stack.remove(id);
  }, [id]);

  return {
    isActive,
    push,
    remove,
  };
}
