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
  SheetModalMethods,
  SheetModalStore,
  ContentLayout,
  SheetModalWithChildren,
} from "./types";
import SheetModalContext from "./context";
import { Portal } from "@gorhom/portal";
import SheetModalBackdrop from "./backdrop";
import SheetModalContent from "./content";
import { AniConfig } from "./constants";
import { convertSnapPoints } from "./utils";
import useSheetModalConfigInternal from "./hooks/useSheetModalInternal";
import useMount from "./hooks/useMount";
import useKey from "./hooks/useKey";
import useBackHandler from "./hooks/useBackHandler";
import { WindowContext } from "./hooks/useWindowDimensions";
import { LayoutChangeEvent, View } from "react-native";
import SheetModalStack from "./SheetModalStack";

const SheetModal = forwardRef<SheetModalMethods, SheetModalWithChildren>(
  (_props, ref) => {
    const height = useSharedValue(0);
    const id = useId();
    const contentLayout = useSharedValue<ContentLayout>({
      width: 0,
      height: 0,
    });
    const snapPoints = useSharedValue<number[]>([]);
    const visibilityPercentage = useSharedValue(0);
    const isPanning = useSharedValue(false);
    const config = useSheetModalConfigInternal(_props);
    const y = useSharedValue(config.closeY);
    const _prevDetached = useRef(config.detached);
    const _prevPosition = useRef(config.position);
    const { mount, unmount, isMounted } = useMount(snapPoints, contentLayout);
    const isPresenting = useSharedValue(false);
    const window = useSharedValue({ width: 0, height: 0 });
    const _oldWindowHeight = useRef(0);
    const snapPointIndex = useSharedValue(config.snapPointIndex);

    const getNextSnapPointIndex = useCallback(
      (_snapPoints: number[], _y: number) => {
        "worklet";

        const filterValue = Math.min(_y, Math.max(..._snapPoints));
        return _snapPoints.findIndex((point) => {
          return point > filterValue;
        }) as number;
      },
      []
    );

    const getPreviousSnapPointIndex = useCallback(
      (_snapPoints: number[], _y: number) => {
        "worklet";
        const filterValue = Math.max(_y, Math.min(..._snapPoints));
        const snaps = [..._snapPoints].reverse();

        const reverseIndex = snaps.findIndex((point) => {
          return point < filterValue;
        }) as number;

        if (reverseIndex === -1) {
          return -1;
        }

        return snaps.length - reverseIndex - 1;
      },
      []
    );

    const skippedContentLayout = useSharedValue<ContentLayout | null>(null);
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
        isPresenting.value = true;
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

            isPresenting.value = false;
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
        getYForHeight,
        height,
        isPresenting,
        mount,
        snapPoints,
        snapPointIndex,
        visibilityPercentage,
        y,
      ]
    );

    const close = useCallback(() => {
      cancelAnimation(y);
      cancelAnimation(visibilityPercentage);
      isPresenting.value = false;

      visibilityPercentage.value = withSpring(0, AniConfig);
      y.value = withSpring(config.closeY, AniConfig, (success) => {
        "worklet";

        // Sometimes y value is not set to 0 after animation ends
        if (success) {
          y.value = config.closeY;
        }
      });
    }, [y, visibilityPercentage, isPresenting, config.closeY]);

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
        window.value.height !== _oldWindowHeight.current;
      const positionChanged = config.position.some(
        (v, i) => v !== _prevPosition.current[i]
      );

      _prevDetached.current = config.detached;
      _oldWindowHeight.current = window.value.height;
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
        SheetModalStack.getTop() !== id
      ) {
        return;
      }

      if (store.config.closeOnEscape) {
        close();
        e.stopImmediatePropagation();
      }
    });

    useBackHandler(
      useCallback(() => {
        close();
        return visibilityPercentage.value > 0;
      }, [close, visibilityPercentage.value])
    );

    useEffect(() => {
      updateSnapPoints();
    }, [updateSnapPoints]);

    useAnimatedReaction(
      () =>
        [y.value, isPanning.value, isPresenting.value] as [
          number,
          boolean,
          boolean
        ],
      ([_y, _isPanning, _isPresenting], prevY) => {
        // Unmount if y is 0 and not panning nor presenting
        if (
          _y <= config.closeY &&
          prevY &&
          prevY[0] &&
          !_isPanning &&
          !_isPresenting
        ) {
          runOnJS(unmount)();
          snapPointIndex.value = -1;
        }
      },
      [y, isPanning, isPresenting, config.closeY]
    );

    useAnimatedReaction(
      () => [contentLayout.value],
      () => {
        runOnJS(updateSnapPoints)();
      },
      [contentLayout, updateSnapPoints]
    );

    useAnimatedReaction(
      () => visibilityPercentage.value,
      (v, prevV) => {
        if (v === prevV) {
          return;
        }

        if (v === 1) {
          SheetModalStack.push(id);
        } else if (v === 0) {
          SheetModalStack.remove(id);
        }
      },
      [visibilityPercentage]
    );

    useEffect(() => {
      // Snap to initial snap point on mount
      if (config.snapPointIndex >= 0) {
        snapToIndex(config.snapPointIndex, false);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      close,
      snapToIndex,
    }));

    const store = useMemo<SheetModalStore>(() => {
      return {
        config,

        state: {
          isPanning,
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
      config,
      isPanning,
      snapPoints,
      height,
      y,
      visibilityPercentage,
      contentLayout,
      onContentLayout,
      close,
      getNextSnapPointIndex,
      getPreviousSnapPointIndex,
      getYForHeight,
      snapToIndex,
      snapPointIndex,
    ]);

    return (
      <Portal>
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
        />

        <WindowContext.Provider value={window}>
          {isMounted && (
            <SheetModalContext.Provider value={store}>
              <SheetModalBackdrop />
              <SheetModalContent>{_props.children}</SheetModalContent>
            </SheetModalContext.Provider>
          )}
        </WindowContext.Provider>
      </Portal>
    );
  }
);

SheetModal.displayName = "SheetModal";
export default SheetModal;
