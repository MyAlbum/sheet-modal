import React, { PropsWithChildren, useCallback } from "react";
import useSheetModal from "../hooks/useSheetModal";
import { Platform, PointerEvent, View } from "react-native";
import Animated, {
  useAnimatedReaction,
  useAnimatedRef,
  useScrollViewOffset,
} from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { FlexAlignType } from "react-native";
import usePan from "../hooks/usePan";
import { ContentAnimationStyle, PanDirection } from "../types";
import HandleWrapper from "./HandleWrapper";
import useWindowDimensions from "../hooks/useWindowDimensions";
import useStableAnimatedStyle from "../hooks/useStableAnimatedStyle";
import { DefaultStyle } from "react-native-reanimated/lib/typescript/reanimated2/hook/commonTypes";

const SheetModalContent = (props: PropsWithChildren) => {
  const store = useSheetModal();
  const window = useWindowDimensions();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const containerRef = useAnimatedRef<View>();

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
      const isScrolledAtTop = scrollOffset.value <= 0;

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
      scrollOffset,
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

      if (store.config.detached) {
        // DETACHED
        return {
          transform,
          alignSelf,
          // @ts-ignore
          // eslint-disable-next-line prettier/prettier
          borderBottomLeftRadius: store.config.containerStyle?.borderBottomLeftRadius ?? store.config.containerStyle?.borderRadius ?? 16,
          // @ts-ignore
          // eslint-disable-next-line prettier/prettier
          borderBottomRightRadius: store.config.containerStyle?.borderBottomRightRadius ?? store.config.containerStyle?.borderRadius ?? 16,
          marginLeft: horizontalOffset,
          marginRight: horizontalOffset,
          height: store.state.height.value,
          visibility,
        };
      } else {
        return {
          transform,
          alignSelf,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          marginLeft: alignSelf === "flex-start" ? horizontalOffset : 0,
          marginRight: alignSelf === "flex-end" ? horizontalOffset : 0,
          height: store.state.height.value,
          maxWidth: window.value.width - 2 * horizontalOffset,
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
  ]);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      // Prevent text selection while panning (web)
      if (Platform.OS === "web" && store.state.isPanning.value) {
        e.preventDefault();
      }
    },
    [store.state.isPanning]
  );

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
      <Animated.View
        style={[
          store.config.containerStyle,
          style,
          {
            position: "absolute",
            top: 0,
            minHeight: store.config.minHeight,
          },
        ]}
        onPointerMove={onPointerMove}
      >
        <View
          style={{
            flex: 1,

            // @ts-ignore
            borderRadius: store.config.containerStyle?.borderRadius ?? 0,
            overflow: "hidden",
          }}
        >
          <Animated.ScrollView
            style={{
              width: "100%",
            }}
            onContentSizeChange={store.onContentLayout}
            ref={scrollRef}
            alwaysBounceVertical={false}
            showsVerticalScrollIndicator={false}
          >
            <GestureDetector gesture={pan}>
              <View>{props.children}</View>
            </GestureDetector>
          </Animated.ScrollView>

          <GestureDetector gesture={topbarPan}>
            <View style={store.config.headerStyle}>
              <HandleWrapper />
              {store.config.withClosebutton &&
                store.config.closeButtonComponent?.()}
            </View>
          </GestureDetector>
        </View>
      </Animated.View>
    </View>
  );
};

export default SheetModalContent;
