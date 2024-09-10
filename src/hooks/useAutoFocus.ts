import { useCallback, useRef } from 'react';
import { SharedValue, runOnJS, useAnimatedReaction } from 'react-native-reanimated';

const minVisibility = 0.2;

type Config = {
  visibilityPercentage: SharedValue<number>;
  isActive: SharedValue<boolean>;
};

function useAutoFocus(config: Config) {
  const _ref = useRef<{ focus?: (v?: any) => void }>();
  const { visibilityPercentage, isActive } = config;

  const handleFocus = useCallback(() => {
    try {
      _ref.current?.focus?.({ preventScroll: true });
    } catch (e) {
      _ref.current?.focus?.();
    }
  }, []);

  const ref = useCallback(
    (node: unknown) => {
      if (!node) {
        return;
      }

      _ref.current = node;

      if (isActive.value && visibilityPercentage.value >= minVisibility) {
        handleFocus();
      }
    },
    [handleFocus, isActive, visibilityPercentage]
  );

  useAnimatedReaction(
    () => [isActive.value, visibilityPercentage.value] as const,
    ([_isActive, v], prev) => {
      const focusReady = _isActive && v >= minVisibility;
      if (prev && prev[1] >= v) {
        // If the visibility percentage is not decreasing, don't focus
        return;
      }

      if (focusReady) {
        runOnJS(handleFocus)();
      }
    },
    [isActive, visibilityPercentage]
  );

  return ref;
}

export default useAutoFocus;
