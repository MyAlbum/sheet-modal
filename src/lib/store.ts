import { useCallback, useId, useMemo, useRef } from 'react';
import { Keyboard, StyleSheet, ViewStyle } from 'react-native';
import { cancelAnimation, runOnJS, useAnimatedReaction, useSharedValue, withSpring } from 'react-native-reanimated';
import { AniConfig } from '../constants';
import useAutoFocus from '../hooks/useAutoFocus';
import useBackHandler from '../hooks/useBackHandler';
import useMount from '../hooks/useMount';
import usePropsToConfig from '../hooks/useSheetModalInternal';
import { useStackItem } from '../hooks/useStackItem/useStackItem';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { ContentLayout, SheetModalConfig, SheetModalStore } from '../types';
import { convertSnapPoints, getNextSnapPointIndex, getPreviousSnapPointIndex } from './utils';

function useCreateSheetModalStore(incomingProps: Partial<SheetModalConfig>) {
  const id = useId();
  const stackItem = useStackItem(id);
  const config = usePropsToConfig(incomingProps);

  // STATE
  const height = useSharedValue(0);
  const width = useSharedValue(0);
  const contentLayout = useSharedValue<ContentLayout>({
    width: 0,
    height: 0,
  });
  const snapPoints = useSharedValue<number[]>([]);
  const visibilityPercentage = useSharedValue(0);
  const isPanning = useSharedValue(false);
  const y = useSharedValue(config.value.closeY);
  const snapPointIndex = useSharedValue(-1);
  const isClosed = useSharedValue(false);

  const skippedContentLayout = useSharedValue<ContentLayout | null>(null);
  const window = useWindowDimensions();
  const _prevDetached = useRef(config.value.detached);
  const _prevPosition = useRef(config.value.position);
  const _prevWindowHeight = useRef(0);
  const { mount, isMounted, unmount } = useMount(snapPoints, contentLayout);

  const autoFocus = useAutoFocus({
    visibilityPercentage: visibilityPercentage,
    isActive: stackItem.isActive,
  });

  useAnimatedReaction(
    () => isPanning.value,
    (p, prevP) => {
      if (!p && prevP === true) {
        // Panning ended, if there is skipped content layout, update content layout
        if (skippedContentLayout.value !== null) {
          contentLayout.value = {
            width: skippedContentLayout.value.width,
            height: skippedContentLayout.value.height,
          };

          skippedContentLayout.value = null;
        }
      }
    },
    [isPanning]
  );

  const setContentLayout = useCallback(
    (_width: number, _height: number) => {
      if (isPanning.value) {
        // Don't update contentLayout while panning, it will be updated after panning ends
        skippedContentLayout.value = { width: _width, height: _height };
        return;
      }

      if (contentLayout.value.height === _height && contentLayout.value.width === _width) {
        return;
      }

      skippedContentLayout.value = null;
      contentLayout.value = {
        width: _width,
        height: _height,
      };

      // If width is 0, don't animate width
      width.value = width.value > 0 ? withSpring(_width, AniConfig) : _width;
    },
    [contentLayout, isPanning, skippedContentLayout, width]
  );

  const getYForHeight = useCallback(
    (h: number) => {
      'worklet';

      let newY = 0;
      if (config.value.detached) {
        if (config.value.position[0] === 'center') {
          newY = window.value.height / 2 + h / 2;
        } else if (config.value.position[0] === 'bottom') {
          newY = h + config.value.offset[0];
        } else if (config.value.position[0] === 'top') {
          newY = window.value.height - config.value.offset[0];
        }
      } else {
        newY = h;
      }

      return newY;
    },
    [config, window]
  );

  const snapToIndex = useCallback(
    (index: number = 0, animate: boolean = true) => {
      if (isClosed.value) {
        return;
      }

      snapPointIndex.value = index;
      stackItem.push();

      mount(() => {
        cancelAnimation(height);
        cancelAnimation(visibilityPercentage);
        cancelAnimation(y);

        const newH = snapPoints.value[index];
        if (newH === undefined) {
          console.warn(`Snap point index ${index} is out of range`);
          return;
        }

        const newY = getYForHeight(newH);
        const onPresented = (finished?: boolean) => {
          'worklet';
          if (!finished) {
            return;
          }

          visibilityPercentage.value = 1;
        };

        if (!animate) {
          y.value = newY;
          height.value = newH;
          onPresented(true);
        } else {
          if (y.value < 0) {
            height.value = newH;
          }

          y.value = withSpring(newY, AniConfig, onPresented);
          height.value = withSpring(newH, AniConfig);
          visibilityPercentage.value = withSpring(1, AniConfig);
        }
      });
    },
    [isClosed, snapPointIndex, stackItem, mount, height, visibilityPercentage, y, snapPoints, getYForHeight]
  );

  const close = useCallback(() => {
    if (isClosed.value) {
      return;
    }

    isClosed.value = true;
    cancelAnimation(y);
    cancelAnimation(visibilityPercentage);

    if (stackItem.isActive.value) {
      // If this modal is the current active modal, dismiss keyboard
      Keyboard.dismiss();
    }

    visibilityPercentage.value = withSpring(0, AniConfig);
    y.value = withSpring(config.value.closeY, AniConfig, () => {
      'worklet';

      y.value = config.value.closeY;
      visibilityPercentage.value = 0;
    });
  }, [config, isClosed, stackItem.isActive, visibilityPercentage, y]);

  // Extra height caused by border
  const borderHeight = useMemo(() => {
    const containerStyle: ViewStyle = config.value.containerStyle ? (StyleSheet.flatten(config.value.containerStyle) as {}) : {};
    const borderTop = containerStyle ? containerStyle.borderTopWidth || containerStyle.borderWidth || 0 : 0;
    const borderBottom = containerStyle ? containerStyle.borderBottomWidth || containerStyle.borderWidth || 0 : 0;

    return borderTop + borderBottom;
  }, [config.value.containerStyle]);

  // Update snapPoints using window size and layout
  const updateSnapPoints = useCallback(() => {
    const offsetYSpacing = config.value.detached ? config.value.offset[0] * 2 : config.value.offset[0];
    const neededHeight = contentLayout.value.height ? contentLayout.value.height + borderHeight : 0;
    const availableWindowHeight = window.value.height - offsetYSpacing;
    const convertConfig = {
      windowHeight: window.value.height,
      maxHeight: Math.min(availableWindowHeight, neededHeight),
      minHeight: Math.min(neededHeight, config.value.minHeight),
    };
    const _snapPoints = convertSnapPoints(config.value.snapPoints, convertConfig);

    // Detect changes
    const snapPointsChanged = _snapPoints.length !== snapPoints.value.length || !_snapPoints.every((point, i) => point === snapPoints.value[i]);
    const detachedChanged = config.value.detached !== _prevDetached.current;
    const windowHeightChanged = window.value.height !== _prevWindowHeight.current;
    const positionChanged = config.value.position.some((v, i) => v !== _prevPosition.current[i]);

    _prevDetached.current = config.value.detached;
    _prevWindowHeight.current = window.value.height;
    _prevPosition.current = config.value.position;

    if (snapPointsChanged) {
      snapPoints.value = _snapPoints;
    }

    if ((snapPointsChanged || detachedChanged || windowHeightChanged || positionChanged) && y.value > 0) {
      // Only update height if snap points or detached snap point changed
      const animated = !windowHeightChanged;
      const newHeight = _snapPoints[snapPointIndex.value] || _snapPoints[0];
      const newY = getYForHeight(newHeight);
      if (animated) {
        height.value = withSpring(newHeight, AniConfig);
        y.value = withSpring(newY, AniConfig);
      } else {
        height.value = newHeight;
        y.value = newY;
      }
    }
  }, [config, contentLayout, borderHeight, window, snapPoints, y, snapPointIndex, getYForHeight, height]);

  useAnimatedReaction(
    () => [visibilityPercentage.value, isPanning.value] as const,
    (v, prevV) => {
      if (v[0] === 0 && prevV?.[0] && !isPanning.value) {
        // Close when visibilityPercentage is 0 and not panning
        isClosed.value = true;
        runOnJS(stackItem.remove)();
        runOnJS(unmount)();
      }
    },
    [visibilityPercentage, isPanning, stackItem, unmount]
  );

  useAnimatedReaction(
    () => [contentLayout.value, config.value, window.value] as const,
    () => {
      runOnJS(updateSnapPoints)();
    },
    [contentLayout, window, config, updateSnapPoints]
  );

  useBackHandler(
    useCallback(() => {
      if (!visibilityPercentage.value || !stackItem.isActive.value) {
        return false;
      }

      close();
      return true;
    }, [close, stackItem.isActive, visibilityPercentage])
  );

  return useMemo<SheetModalStore>(() => {
    return {
      id,

      config,

      state: {
        contentLayout,
        height,
        width,
        isActive: stackItem.isActive,
        isClosed,
        isMounted,
        isPanning,
        snapPointIndex,
        snapPoints,
        visibilityPercentage,
        y,
      },

      setContentLayout,
      getNextSnapPointIndex,
      getPreviousSnapPointIndex,
      getYForHeight,
      autoFocus,
      close,
      snapToIndex,
    };
  }, [
    autoFocus,
    close,
    config,
    contentLayout,
    getYForHeight,
    height,
    width,
    id,
    isClosed,
    isMounted,
    isPanning,
    setContentLayout,
    snapPointIndex,
    snapPoints,
    snapToIndex,
    stackItem.isActive,
    visibilityPercentage,
    y,
  ]);
}

export default useCreateSheetModalStore;
