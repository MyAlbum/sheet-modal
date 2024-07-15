import React, { forwardRef, useCallback, useImperativeHandle } from 'react';
import { ScrollViewProps, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedRef, useScrollViewOffset } from 'react-native-reanimated';
import useSheetModal from '..//hooks/useSheetModal';
import usePan from '../hooks/usePan';
import { PanData } from '../types';

const ScrollView = forwardRef<Animated.ScrollView, ScrollViewProps>((props, incomingRef) => {
  const store = useSheetModal();
  const ref = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(ref);

  useImperativeHandle(incomingRef, () => ref.current!, [ref]);

  const onStartShouldSetPanResponder = useCallback(
    (data: PanData) => {
      'worklet';
      if (props.horizontal || !store.config.value.panContent) {
        // Don't pan if horizontal or panContent is disabled
        return false;
      }

      const relevantSnapPoints = store.state.snapPoints.value;
      const canPanUp = store.state.height.value < relevantSnapPoints.at(-1)!;
      const canScroll = store.state.height.value < store.state.contentLayout.value.height;
      const isScrolledAtTop = scrollOffset.value <= 0;

      if (data.direction === 'up') {
        if (!canPanUp) {
          // Sheet is at max snap point, allow pan if we can't scroll
          return !canScroll;
        } else {
          // Pan up, sheet not at max snap point
          return true;
        }
      } else {
        return isScrolledAtTop;
      }
    },
    [props.horizontal, store.config, store.state.snapPoints, store.state.height, store.state.contentLayout, scrollOffset]
  );

  const pan = usePan({
    onStartShouldSetPanResponder,
  });

  return (
    <Animated.ScrollView
      {...props}
      ref={ref}
    >
      <GestureDetector gesture={pan}>
        <View>{props.children}</View>
      </GestureDetector>
    </Animated.ScrollView>
  );
});
ScrollView.displayName = 'ScrollView';

export default ScrollView;
