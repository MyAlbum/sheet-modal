import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import { SheetModalStore } from "../types";

export function useEventsToProps(modal: SheetModalStore) {
  useAnimatedReaction(
    () => [modal.state.visibilityPercentage.value, modal.state.isPanning.value],
    (current, prev) => {
      const [v, p] = current as [number, boolean];

      if (!p && v <= 0 && prev?.[0]) {
        //closed
        if (modal.config.onClosed !== undefined) {
          runOnJS(modal.config.onClosed)();
        }
      }

      if (!p && v === 1 && prev?.[0] !== 1) {
        //opened

        if (modal.config.onOpened !== undefined) {
          runOnJS(modal.config.onOpened)();
        }
      }
    },
    [modal.state.visibilityPercentage, modal.state.isPanning]
  );
}
