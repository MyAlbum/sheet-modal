import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import { SheetModalStore } from "../types";
import { useCallback } from "react";

export function useEventsToProps(store: SheetModalStore) {
  const onClosed = useCallback(() => {
    store.config.value.onClosed?.();
  }, [store.config]);

  const onOpened = useCallback(() => {
    store.config.value.onOpened?.();
  }, [store.config]);

  useAnimatedReaction(
    () => [store.state.visibilityPercentage.value, store.state.isPanning.value],
    (current, prev) => {
      const [v, p] = current as [number, boolean];

      if (!p && v <= 0 && prev?.[0]) {
        //closed
        runOnJS(onClosed)();
      }

      if (!p && v === 1 && prev?.[0] !== 1) {
        //opened
        runOnJS(onOpened)();
      }
    },
    [store.state.visibilityPercentage, store.state.isPanning]
  );
}
