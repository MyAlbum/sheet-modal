import { useCallback, useRef } from 'react';
import { SharedValue, runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

const minVisibility = 0.1;

type Config = {
  visibilityPercentage: SharedValue<number>;
  isActive: SharedValue<boolean>;
};

function useAutoFocus(config: Config) {
  const _ref = useRef<{ focus?: (v?: any) => void }>();
  const handled = useSharedValue(false);
  const { visibilityPercentage, isActive } = config;

  const handleFocus = useCallback(() => {
    if (handled.value || !_ref.current || !isActive.value || visibilityPercentage.value < minVisibility) {
      return;
    }

    try {
      _ref.current?.focus?.({ preventScroll: true });
    } catch (e) {
      _ref.current?.focus?.();
    }

    handled.value = true;
  }, [handled, isActive, visibilityPercentage]);

  const ref = useCallback(
    (node: unknown) => {
      if (!node) {
        return;
      }

      _ref.current = node;
      handleFocus();
    },
    [handleFocus]
  );

  useAnimatedReaction(
    () => [isActive.value, visibilityPercentage.value] as const,
    ([_isActive, v], prev) => {
      const focusReady = _isActive && v >= minVisibility;
      const prevFocusReady = prev ? prev[0] && prev[1] >= minVisibility : false;

      if (focusReady && !prevFocusReady) {
        runOnJS(handleFocus)();
      }
    },
    [isActive, visibilityPercentage]
  );

  return ref;
}

export default useAutoFocus;
