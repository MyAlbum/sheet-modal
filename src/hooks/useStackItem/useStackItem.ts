import { useCallback } from "react";
import { FocusStack } from "./store";
import { useSharedValue } from "react-native-reanimated";
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
