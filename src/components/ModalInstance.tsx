import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  useSharedValue,
  cancelAnimation,
  useAnimatedReaction,
  runOnJS,
  withSpring,
} from "react-native-reanimated";
import type {
  SheetModalInstanceMethods,
  SheetModalStore,
  ContentLayout,
  SheetModalWithChildren,
} from "../types";
import SheetModalContext from "../context";
import SheetModalBackdrop from "./Backdrop";
import SheetModalContent from "./Content";
import { AniConfig } from "../constants";
import {
  convertSnapPoints,
  getNextSnapPointIndex,
  getPreviousSnapPointIndex,
} from "../lib/utils";
import useSheetModalConfigInternal from "../hooks/useSheetModalInternal";
import useMount from "../hooks/useMount";
import useKey from "../hooks/useKey";
import useBackHandler from "../hooks/useBackHandler";
import { WindowContext } from "../hooks/useWindowDimensions";
import { LayoutChangeEvent, View } from "react-native";
import sheetModalStack from "../lib/sheetModalStack";
import PortalComponent from "./Portal/Portal";

const SheetModalInstance = forwardRef<
  SheetModalInstanceMethods,
  SheetModalWithChildren
>((_props, ref) => {
  const height = useSharedValue(0);
  const id = useId();
  const config = useSheetModalConfigInternal(_props);
  const _prevDetached = useRef(config.detached);
  const _prevPosition = useRef(config.position);
  const _prevWindowHeight = useRef(0);

  const contentLayout = useSharedValue<ContentLayout>({
    width: 0,
    height: 0,
  });
  const snapPoints = useSharedValue<number[]>([]);
  const visibilityPercentage = useSharedValue(0);
  const isPanning = useSharedValue(false);
  const y = useSharedValue(config.closeY);
  const { mount, isMounted, unmount } = useMount(snapPoints, contentLayout);
  const window = useSharedValue({ width: 0, height: 0 });
  const snapPointIndex = useSharedValue(-1);
  const _isClosed = useSharedValue(false);
  const skippedContentLayout = useSharedValue<ContentLayout | null>(null);

  const isClosed = useCallback(() => {
    return _isClosed.value;
  }, [_isClosed]);

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

  const onContentLayout = useCallback(
    (_width: number, _height: number) => {
      if (isPanning.value) {
        // Don't update contentLayout while panning, it will be updated after panning ends
        skippedContentLayout.value = { width: _width, height: _height };
        return;
      }

      if (
        contentLayout.value.height === _height &&
        contentLayout.value.width === _width
      ) {
        return;
      }

      skippedContentLayout.value = null;
      contentLayout.value = {
        width: _width,
        height: _height,
      };
    },
    [contentLayout, isPanning, skippedContentLayout]
  );

  const onWindowResize = useCallback(
    (e: LayoutChangeEvent) => {
      window.value = {
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height,
      };
    },
    [window]
  );

  const getYForHeight = useCallback(
    (h: number) => {
      "worklet";

      let newY = 0;
      if (config.detached) {
        if (config.position[0] === "center") {
          newY = window.value.height / 2 + h / 2;
        } else if (config.position[0] === "bottom") {
          newY = h + config.offset[0];
        } else if (config.position[0] === "top") {
          newY = window.value.height - config.offset[0];
        }
      } else {
        newY = h;
      }

      return newY;
    },
    [config.detached, config.position, config.offset, window]
  );

  const snapToIndex = useCallback(
    (index: number = 0, animate: boolean = true) => {
      if (_isClosed.value) {
        return;
      }

      if (index > -1) {
        sheetModalStack.push(id);
      }

      snapPointIndex.value = index;

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
          "worklet";
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
    [
      _isClosed,
      snapPointIndex,
      mount,
      id,
      height,
      visibilityPercentage,
      y,
      snapPoints,
      getYForHeight,
    ]
  );

  const close = useCallback(() => {
    if (_isClosed.value) {
      return;
    }

    _isClosed.value = true;
    cancelAnimation(y);
    cancelAnimation(visibilityPercentage);
    sheetModalStack.remove(id);

    visibilityPercentage.value = withSpring(0, AniConfig);
    y.value = withSpring(config.closeY, AniConfig, () => {
      "worklet";

      y.value = config.closeY;
      visibilityPercentage.value = 0;
      runOnJS(unmount)();
    });
  }, [_isClosed, y, visibilityPercentage, id, config.closeY, unmount]);

  const updateSnapPoints = useCallback(() => {
    // Update snapPoints using window size and layout
    const offsetYSpacing = config.detached
      ? config.offset[0] * 2
      : config.offset[0];
    const convertConfig = {
      windowHeight: window.value.height,
      maxHeight: Math.min(
        window.value.height - offsetYSpacing,
        contentLayout.value.height
      ),
      minHeight: Math.min(contentLayout.value.height, config.minHeight),
    };
    const _snapPoints = convertSnapPoints(config.snapPoints, convertConfig);

    // Detect changes
    const snapPointsChanged =
      _snapPoints.length !== snapPoints.value.length ||
      !_snapPoints.every((point, i) => point === snapPoints.value[i]);
    const detachedChanged = config.detached !== _prevDetached.current;
    const windowHeightChanged =
      window.value.height !== _prevWindowHeight.current;
    const positionChanged = config.position.some(
      (v, i) => v !== _prevPosition.current[i]
    );

    _prevDetached.current = config.detached;
    _prevWindowHeight.current = window.value.height;
    _prevPosition.current = config.position;

    if (snapPointsChanged) {
      snapPoints.value = _snapPoints;
    }

    // CONDITIONAL LAYOUT UPDATES
    // Don't update height if not detached and autoResize is disabled
    if (!config.autoResize && !detachedChanged) {
      return;
    }

    if (
      (snapPointsChanged ||
        detachedChanged ||
        windowHeightChanged ||
        positionChanged) &&
      y.value > 0
    ) {
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
  }, [
    config.detached,
    config.offset,
    config.minHeight,
    config.snapPoints,
    config.position,
    config.autoResize,
    window,
    contentLayout,
    snapPoints,
    y,
    snapPointIndex,
    getYForHeight,
    height,
  ]);

  useKey("Escape", (e) => {
    if (
      !store.state.visibilityPercentage.value ||
      sheetModalStack.getTop() !== id
    ) {
      return;
    }

    if (store.config.closeOnEscape) {
      close();
      e.stopImmediatePropagation();
    }
  });

  useAnimatedReaction(
    () => [contentLayout.value, window.value],
    () => {
      runOnJS(updateSnapPoints)();
    },
    [contentLayout, window, updateSnapPoints]
  );

  useEffect(() => {
    // Snap to initial snap point on mount
    if (config.snapPointIndex >= 0) {
      snapToIndex(config.snapPointIndex, config.animateOnMount);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    close,
    snapToIndex,
    isClosed,
  }));

  const store = useMemo<SheetModalStore>(() => {
    return {
      id,
      config,

      state: {
        isPanning,
        isClosed: _isClosed,
        snapPoints,
        snapPointIndex,
        height,
        y,
        visibilityPercentage,
        contentLayout,
      },

      close,
      snapToIndex,

      onContentLayout,
      getNextSnapPointIndex,
      getPreviousSnapPointIndex,
      getYForHeight,
    };
  }, [
    id,
    config,
    isPanning,
    _isClosed,
    snapPoints,
    height,
    y,
    visibilityPercentage,
    contentLayout,
    onContentLayout,
    close,
    getYForHeight,
    snapToIndex,
    snapPointIndex,
  ]);

  useBackHandler(
    useCallback(() => {
      if (
        !store.state.visibilityPercentage.value ||
        sheetModalStack.getTop() !== id
      ) {
        return false;
      }

      close();
      return true;
    }, [close, id, store])
  );

  if (!isMounted) {
    return null;
  }

  return (
    <PortalComponent>
      <View
        onLayout={onWindowResize}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
        }}
        testID={`${id}-window`}
      />

      <WindowContext.Provider value={window}>
        <SheetModalContext.Provider value={store}>
          <SheetModalBackdrop />
          <SheetModalContent>{_props.children}</SheetModalContent>
        </SheetModalContext.Provider>
      </WindowContext.Provider>
    </PortalComponent>
  );
});

SheetModalInstance.displayName = "SheetModalInstance";
export default SheetModalInstance;
