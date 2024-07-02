import React, { PropsWithChildren, useCallback, useMemo, useRef } from "react";
import useSheetModal from "../hooks/useSheetModal";
import { Platform, PointerEvent, View, ViewStyle } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
} from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { FlexAlignType } from "react-native";
import usePan from "../hooks/usePan";
import { ContentAnimationStyle, PanDirection } from "../types";
import HandleWrapper from "./HandleWrapper";
import useWindowDimensions from "../hooks/useWindowDimensions";
import useStableAnimatedStyle from "../hooks/useStableAnimatedStyle";
import { DefaultStyle } from "react-native-reanimated/lib/typescript/reanimated2/hook/commonTypes";
import FocusTrap, { FocusTrapOptions } from "./FocusTrap";

const SheetModalContent = (props: PropsWithChildren) => {
  const store = useSheetModal();
  const window = useWindowDimensions();
  const containerRef = useAnimatedRef<View>();
  const _setReadyForFocus = useRef<() => void>(() => {});

  const setReadyForFocus = useCallback(() => {
    _setReadyForFocus.current?.();
  }, []);

  const onStartShouldSetPanResponder = useCallback(
    (gestureDirection: PanDirection) => {
      "worklet";
      if (!store.config.panContent) {
        return false;
      }

      const relevantSnapPoints = store.state.snapPoints.value;
      const canPanUp = store.state.height.value < relevantSnapPoints.at(-1)!;
      const canScroll =
        store.state.height.value < store.state.contentLayout.value.height;
      const isScrolledAtTop = true; //scrollOffset.value <= 0;

      if (gestureDirection === "up") {
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
    [
      store.state.contentLayout,
      store.state.height,
      store.state.snapPoints,
      store.config.panContent,
    ]
  );

  const pan = usePan({
    onStartShouldSetPanResponder,
  });

  const onTopBarPanStartShouldSetPanResponder = useCallback(() => {
    "worklet";
    return true;
  }, []);

  const topbarPan = usePan({
    onStartShouldSetPanResponder: onTopBarPanStartShouldSetPanResponder,
  });

  const horizontalPosition = store.config.position[1];
  const horizontalOffset = store.config.offset[1];

  useAnimatedReaction(
    () => store.state.isClosed.value,
    (isClosed) => {
      if (Platform.OS !== "web") {
        return;
      }

      if (isClosed) {
        // @ts-expect-error
        containerRef.current?.setAttribute("inert", true);
      } else {
        // @ts-expect-error
        containerRef.current?.removeAttribute("inert");
      }
    },
    [store.state.y]
  );

  const style = useStableAnimatedStyle(() => {
    "worklet";

    const getStyle = (): ContentAnimationStyle => {
      const alignSelf: FlexAlignType =
        horizontalPosition === "center"
          ? "center"
          : horizontalPosition === "left"
          ? "flex-start"
          : "flex-end";
      const transform = [{ translateY: -store.state.y.value }];
      const visibility =
        store.state.y.value <= store.config.closeY ? "hidden" : "visible";

      const width = Math.min(
        store.state.contentLayout.value.width,
        window.value.width - 2 * horizontalOffset
      );

      if (store.config.detached) {
        // DETACHED
        return {
          transform,
          alignSelf,
          marginLeft: horizontalOffset,
          marginRight: horizontalOffset,
          height: store.state.height.value,
          width,
          visibility,
        };
      } else {
        return {
          transform,
          alignSelf,
          marginLeft: alignSelf === "flex-start" ? horizontalOffset : 0,
          marginRight: alignSelf === "flex-end" ? horizontalOffset : 0,
          height: store.state.height.value,
          width,
          visibility,
        };
      }
    };

    return getStyle() as DefaultStyle;
  }, [
    window,
    store.config.containerStyle,
    horizontalOffset,
    horizontalPosition,
    store.state.y,
    store.state.height,
    store.state.contentLayout,
  ]);

  const measureStyle = useStableAnimatedStyle(() => {
    "worklet";

    const getStyle = (): ViewStyle => {
      // Width should be undefined at first render
      const width =
        store.state.contentLayout.value.width > 0
          ? Math.min(
              store.state.contentLayout.value.width,
              window.value.width - 2 * horizontalOffset
            )
          : undefined;

      return {
        width,
        position: "absolute",
        top: 0,
        height: 0,
        left: 0,
        pointerEvents: "none",
        opacity: 0,
        overflow: "hidden",
      };
    };

    return getStyle() as DefaultStyle;
  }, [window, store.state.contentLayout, store.config.minHeight]);

  // @ts-ignore
  // eslint-disable-next-line prettier/prettier
  const borderBottomLeftRadius = !store.config.detached ? 0 : store.config.containerStyle?.borderBottomLeftRadius ?? store.config.containerStyle?.borderRadius ?? 16;

  // @ts-ignore
  // eslint-disable-next-line prettier/prettier
  const borderBottomRightRadius = !store.config.detached ? 0 : store.config.containerStyle?.borderBottomRightRadius ?? store.config.containerStyle?.borderRadius ?? 16;


  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      // Prevent text selection while panning (web)
      if (Platform.OS === "web" && store.state.isPanning.value) {
        e.preventDefault();
      }
    },
    [store.state.isPanning]
  );

  useAnimatedReaction(
    () =>
      store.state.visibilityPercentage.value === 1 &&
      store.state.isActive.value,
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
      checkCanFocusTrap: () => {
        return new Promise<void>((resolve) => {
          _setReadyForFocus.current = resolve;
        });
      },
    };
  }, []);

  return (
    <View
      ref={containerRef}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      }}
      testID={`${store.id}-content`}
    >
      <Animated.View style={measureStyle} aria-hidden={true}>
        <View
          onLayout={(e) => {
            store.onContentLayout(
              e.nativeEvent.layout.width,
              e.nativeEvent.layout.height
            );
          }}
        >
          {props.children}
        </View>
      </Animated.View>

      <Animated.View
        style={[
          store.config.containerStyle,
          style,
          {
            borderBottomRightRadius,
            borderBottomLeftRadius,
            position: "absolute",
            top: 0,
            minHeight: store.config.minHeight,
          },
        ]}
        onPointerMove={onPointerMove}
      >
        <FocusTrap
          active={store.config.withFocusTrap}
          focusTrapOptions={focusTrapOptions}
        >
          <View
            style={{
              flex: 1,

              // @ts-ignore
              borderRadius: store.config.containerStyle?.borderRadius ?? 0,
              borderBottomRightRadius,
              borderBottomLeftRadius,
              overflow: "hidden",
            }}
          >
            <GestureDetector gesture={pan}>
              <View style={{ flex: 1 }}>{props.children}</View>
            </GestureDetector>

            <GestureDetector gesture={topbarPan}>
              <View style={store.config.headerStyle}>
                <HandleWrapper />
                {store.config.withClosebutton &&
                  store.config.closeButtonComponent?.()}
              </View>
            </GestureDetector>
          </View>
        </FocusTrap>
      </Animated.View>
    </View>
  );
};

export default SheetModalContent;
