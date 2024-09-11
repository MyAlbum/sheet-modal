import React, { PropsWithChildren, useCallback, useMemo, useRef } from 'react';
import { FlexAlignType, LayoutChangeEvent, Platform, PointerEvent, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedReaction, useAnimatedRef } from 'react-native-reanimated';
import usePan from '../hooks/usePan';
import useSharedState from '../hooks/useSharedState';
import useSheetModal from '../hooks/useSheetModal';
import useStableAnimatedStyle from '../hooks/useStableAnimatedStyle';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { ContentAnimationStyle, PanData } from '../types';
import FocusTrap, { FocusTrapOptions } from './FocusTrap';
import HandleWrapper from './HandleWrapper';

const SheetModalContent = (props: PropsWithChildren) => {
  const store = useSheetModal();
  const window = useWindowDimensions();
  const containerRef = useAnimatedRef<View>();
  const _setReadyForFocus = useRef<() => void>(() => {});
  const config = useSharedState(store.config);

  const setReadyForFocus = useCallback(() => {
    _setReadyForFocus.current?.();
  }, []);

  const onStartShouldSetPanResponder = useCallback(
    (data: PanData) => {
      'worklet';
      if (!store.config.value.panContent) {
        if (data.startY < 50) {
          return true;
        }
        return false;
      }

      const relevantSnapPoints = store.state.snapPoints.value;
      const canPanUp = store.state.height.value < relevantSnapPoints.at(-1)!;
      const canScroll = store.state.height.value < store.state.contentLayout.value.height;
      const isScrolledAtTop = true; //scrollOffset.value <= 0;

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
    [store.config.value.panContent, store.state.snapPoints.value, store.state.height.value, store.state.contentLayout.value.height]
  );

  const pan = usePan({
    onStartShouldSetPanResponder,
  });

  const horizontalPosition = store.config.value.position[1];
  const horizontalOffset = store.config.value.offset[1];

  useAnimatedReaction(
    () => store.state.isClosed.value,
    (isClosed) => {
      if (Platform.OS !== 'web') {
        return;
      }

      if (isClosed) {
        // @ts-expect-error
        containerRef.current?.setAttribute('inert', true);
      } else {
        // @ts-expect-error
        containerRef.current?.removeAttribute('inert');
      }
    },
    [store.state.y]
  );

  const style = useStableAnimatedStyle(() => {
    'worklet';

    const getStyle = (): ContentAnimationStyle => {
      const alignSelf: FlexAlignType = horizontalPosition === 'center' ? 'center' : horizontalPosition === 'left' ? 'flex-start' : 'flex-end';
      const transform = [{ translateY: -store.state.y.value }];
      const visibility = store.state.y.value <= store.config.value.closeY ? 'hidden' : 'visible';
      const width = Math.min(store.state.width.value, window.value.width - 2 * horizontalOffset);

      if (store.config.value.detached) {
        // DETACHED
        return {
          transform,
          alignSelf,
          marginLeft: horizontalOffset,
          marginRight: horizontalOffset,
          height: store.state.height.value,
          minHeight: store.state.contentLayout.value.height > 0 ? store.config.value.minHeight : 0,
          width,
          visibility,
        };
      } else {
        return {
          transform,
          alignSelf,
          marginLeft: alignSelf === 'flex-start' ? horizontalOffset : 0,
          marginRight: alignSelf === 'flex-end' ? horizontalOffset : 0,
          height: store.state.height.value,
          minHeight: store.state.contentLayout.value.height > 0 ? store.config.value.minHeight : 0,
          width,
          visibility,
        };
      }
    };

    return getStyle();
  }, [
    window,
    store.config.value.containerStyle,
    store.config.value.minHeight,
    horizontalOffset,
    horizontalPosition,
    store.state.y,
    store.state.height,
    store.state.contentLayout,
  ]);

  const contentStyle = useStableAnimatedStyle(() => {
    'worklet';

    const hasLayout = store.state.contentLayout.value.height > 0;

    if (hasLayout) {
      return {
        flex: 1,
        height: '100%',
      };
    } else {
      return {
        position: 'absolute',
        top: 0,
      };
    }
  }, [store.state.contentLayout]);

  // @ts-ignore
  const borderBottomLeftRadius = !config.detached ? 0 : config.containerStyle?.borderBottomLeftRadius ?? config.containerStyle?.borderRadius ?? 16;

  // @ts-ignore
  const borderBottomRightRadius = !config.detached ? 0 : config.containerStyle?.borderBottomRightRadius ?? config.containerStyle?.borderRadius ?? 16;

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      // Prevent text selection while panning (web)
      if (Platform.OS === 'web' && store.state.isPanning.value) {
        e.preventDefault();
      }
    },
    [store.state.isPanning]
  );

  useAnimatedReaction(
    () => store.state.visibilityPercentage.value === 1 && store.state.isActive.value,
    (v) => {
      if (v) {
        runOnJS(setReadyForFocus)();
      }
    },
    [store.state.isActive, store.state.visibilityPercentage]
  );

  const focusTrapOptions = useMemo<FocusTrapOptions>(() => {
    return {
      allowOutsideClick: true,
      initialFocus: false,
      escapeDeactivates: false,
      checkCanFocusTrap: () => {
        return new Promise<void>((resolve) => {
          _setReadyForFocus.current = resolve;
        });
      },
    };
  }, []);

  const onContentLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (store.state.contentLayout.value.height > 0) {
        // Content is already laid out, skip
        return;
      }

      store.setContentLayout(e.nativeEvent.layout.width, e.nativeEvent.layout.height);
    },
    [store]
  );

  return (
    <View
      ref={containerRef}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }}
      testID={`${store.id}-content`}
    >
      <Animated.View
        style={[
          store.config.value.containerStyle,
          style,
          {
            borderBottomRightRadius,
            borderBottomLeftRadius,
            position: 'absolute',
            top: 0,
          },
        ]}
        onPointerMove={onPointerMove}
      >
        <FocusTrap
          active={config.withFocusTrap}
          focusTrapOptions={focusTrapOptions}
        >
          <View
            style={{
              flex: 1,

              // @ts-ignore
              borderRadius: store.config.containerStyle?.borderRadius ?? 0,
              borderBottomRightRadius,
              borderBottomLeftRadius,
              overflow: 'hidden',
            }}
          >
            <GestureDetector gesture={pan}>
              <Animated.View
                style={[contentStyle]}
                onLayout={onContentLayout}
              >
                {props.children}
              </Animated.View>
            </GestureDetector>

            <View style={store.config.value.headerStyle}>
              <HandleWrapper />
            </View>

            {config.withClosebutton && config.closeButtonComponent?.()}
          </View>
        </FocusTrap>
      </Animated.View>
    </View>
  );
};

export default SheetModalContent;
