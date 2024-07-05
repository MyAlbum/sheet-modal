import { useCallback, useMemo, useRef } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
  useSharedValue,
  withSpring,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import useSheetModal from "./useSheetModal";
import { AniConfig, overDragResistanceFactor } from "../constants";
import { PanConfig } from "../types";
import useWindowDimensions from "./useWindowDimensions";
import { Keyboard, Platform } from "react-native";

function usePan(panConfig: PanConfig) {
  const store = useSheetModal();
  const startPos = useSharedValue({ x: 0, y: 0 });
  const oldY = useSharedValue(0);
  const isFinishingPan = useSharedValue(false);
  const isActive = useSharedValue(false);
  const window = useWindowDimensions();
  const initialUserSelect = useRef<any>(undefined);

  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const preventTextSelection = useCallback((state: boolean) => {
    if (Platform.OS !== "web") {
      return;
    }

    if (state) {
      if (initialUserSelect.current === undefined) {
        // Save the initial user select value
        initialUserSelect.current =
          document.body.style.getPropertyValue("user-select") ||
          document.body.style.getPropertyValue("-webkit-user-select");
      }

      document.body.style.setProperty("-webkit-user-select", "none");
      document.body.style.setProperty("user-select", "none");
    } else {
      if (!initialUserSelect.current || initialUserSelect.current === "") {
        // No initial user select value, remove the property
        document.body.style.removeProperty("user-select");
        document.body.style.removeProperty("-webkit-user-select");
      } else {
        // Restore the initial user select value
        document.body.style.setProperty(
          "-webkit-user-select",
          initialUserSelect.current
        );
        document.body.style.setProperty(
          "user-select",
          initialUserSelect.current
        );
      }

      // We don't need the initial value anymore
      initialUserSelect.current = undefined;
    }
  }, []);

  const pan = useMemo(() => {
    return Gesture.Pan()
      .manualActivation(false)
      .maxPointers(1)
      .activeCursor("grabbing")
      .onBegin((e) => {
        startPos.value = { x: e.absoluteX, y: e.absoluteY };
        oldY.value = store.state.y.value;

        const relativeStartY =
          startPos.value.y - (window.value.height - store.state.y.value);

        const shouldStart = panConfig.onStartShouldSetPanResponder({
          direction: "unknown", // We haven't moved yet
          startY: relativeStartY,
        });

        if (shouldStart) {
          runOnJS(preventTextSelection)(true);
        }
      })
      .onTouchesMove((e, stateManager) => {
        "worklet";
        if (!e.allTouches[0] || isActive.value) {
          return;
        }

        const moveY = startPos.value.y - e.allTouches[0].absoluteY;
        const moveX = startPos.value.x - e.allTouches[0].absoluteX;
        if (Math.abs(moveY) < 5 && Math.abs(moveX) < 5) {
          // We need to move at least 5 pixels in either direction
          return;
        }

        // Start Y position within the sheet modal
        const relativeStartY =
          startPos.value.y - (window.value.height - store.state.y.value);

        const gestureDirection =
          e.allTouches[0].absoluteY - startPos.value.y > 0 ? "down" : "up";
        if (
          panConfig.onStartShouldSetPanResponder({
            direction: gestureDirection,
            startY: relativeStartY,
          })
        ) {
          // Prevent scroll
          isActive.value = true;
        } else {
          // Horizontal gesture, don't start the pan
          isActive.value = false;
          stateManager.fail();
        }
      })
      .onChange((e) => {
        "worklet";
        if (!isActive.value) {
          return;
        }

        const moveY = startPos.value.y - e.absoluteY;
        const moveX = startPos.value.x - e.absoluteX;
        if (Math.abs(moveY) < 5 && Math.abs(moveX) < 5) {
          return;
        }

        store.state.isPanning.value = true;

        const gestureDirection = moveY < 0 ? "down" : "up";
        const relevantSnapPoints = store.state.snapPoints.value;
        const bottomY = store.getYForHeight(relevantSnapPoints[0]);
        const yTooLow = store.state.y.value <= bottomY;

        let changeY = e.changeY;
        if (
          store.state.y.value >= relevantSnapPoints.at(-1)! &&
          gestureDirection === "up"
        ) {
          // out of bounds (larger than max), make it harder to pan
          changeY = changeY / overDragResistanceFactor;
        } else if (yTooLow) {
          // out of bounds (smaller than min)
          if (!store.config.value.panDownToClose) {
            changeY = changeY / overDragResistanceFactor;
          }
        }

        // if detached and centered double the changeY so it feels more natural
        if (
          store.config.value.position[0] === "center" &&
          store.config.value.detached &&
          !yTooLow
        ) {
          changeY = changeY * 2;
        }

        const newHeight = yTooLow
          ? relevantSnapPoints[0]
          : store.state.height.value - changeY;
        const newY = yTooLow
          ? store.state.y.value - changeY
          : store.getYForHeight(newHeight);

        store.state.height.value = newHeight;
        store.state.y.value = newY;
      })
      .onFinalize(() => {
        isActive.value = false;
        runOnJS(preventTextSelection)(false);
      })
      .onEnd((e) => {
        "worklet";
        if (!isActive.value) {
          return;
        }

        store.state.isPanning.value = false;
        isActive.value = false;
        isFinishingPan.value = true;

        const relevantSnapPoints = store.state.snapPoints.value;
        const direction = e.velocityY < 0 ? "up" : "down";
        const prevSnapPointIndex = Math.max(
          store.config.value.panDownToClose ? -1 : 0,
          store.getPreviousSnapPointIndex(
            relevantSnapPoints,
            store.state.height.value
          )
        );

        let nextSnapPointIndex = store.getNextSnapPointIndex(
          relevantSnapPoints,
          store.state.height.value
        );
        if (nextSnapPointIndex === -1) {
          nextSnapPointIndex = relevantSnapPoints.length - 1;
        }

        const newSnapPointIndex =
          direction === "up" ? nextSnapPointIndex : prevSnapPointIndex;
        const mode = newSnapPointIndex < 0 ? "close" : "resize";

        const onComplete = () => {
          "worklet";
          if (mode === "close") {
            store.state.visibilityPercentage.value = 0;
          }

          isFinishingPan.value = false;
        };

        const newHeight = relevantSnapPoints[newSnapPointIndex];
        store.state.snapPointIndex.value = newSnapPointIndex;

        switch (mode) {
          case "close":
            if (store.state.isActive.value) {
              runOnJS(dismissKeyboard)();
            }

            store.state.y.value = withSpring(
              store.config.value.closeY,
              AniConfig,
              onComplete
            );
            break;
          case "resize":
            const newY = store.getYForHeight(newHeight);
            store.state.height.value = withSpring(
              newHeight,
              AniConfig,
              onComplete
            );
            store.state.y.value = withSpring(newY, AniConfig);
            break;
        }
      });
  }, [
    startPos,
    oldY,
    store,
    preventTextSelection,
    isActive,
    window,
    panConfig,
    isFinishingPan,
    dismissKeyboard,
  ]);

  useAnimatedReaction(
    () => store.state.y.value,
    (y) => {
      if (!store.state.isPanning.value && !isFinishingPan.value) {
        return;
      }

      const newV = Math.max(0, Math.min(1, y / 100));
      if (newV !== store.state.visibilityPercentage.value) {
        store.state.visibilityPercentage.value = newV;
      }
    },
    [store.state.y]
  );

  return pan;
}

export default usePan;
