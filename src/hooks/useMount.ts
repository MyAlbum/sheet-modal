import { useCallback, useMemo, useRef } from 'react';
import { SharedValue, runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

function useMount(snapPoints: SharedValue<number[]>, contentLayout: SharedValue<{ width: number; height: number }>) {
  const isMounted = useSharedValue(true);
  const onContentLayoutCallbacks = useRef<() => void>(() => {});

  const handleContentLayoutCallbacks = useCallback(() => {
    onContentLayoutCallbacks.current();
    onContentLayoutCallbacks.current = () => {};
  }, []);

  useAnimatedReaction(
    () => [snapPoints.value.length > 0],
    ([hasLayout]) => {
      if (hasLayout) {
        runOnJS(handleContentLayoutCallbacks)();
      }
    },
    [snapPoints]
  );

  const mount = useCallback(
    (cb: () => void) => {
      const hasLayout = snapPoints.value.length > 0 && contentLayout.value.height > 0;
      if (hasLayout) {
        return cb();
      }

      onContentLayoutCallbacks.current = cb;
    },
    [contentLayout, snapPoints]
  );

  const unmount = useCallback(() => {
    isMounted.value = false;
  }, [isMounted]);

  return useMemo(() => {
    return {
      mount,
      unmount,
      isMounted,
    };
  }, [isMounted, mount, unmount]);
}

export default useMount;
