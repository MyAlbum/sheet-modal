import { useMemo } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
  useSharedValue,
  withSpring,
  useAnimatedReaction,
} from "react-native-reanimated";
import useSheetModal from "./useSheetModal";
import { AniConfig, overDragResistanceFactor } from "../constants";
import { PanConfig } from "../types";

function usePan(panConfig: PanConfig) {
  const store = useSheetModal();
  const startPos = useSharedValue({ x: 0, y: 0 });
  const oldY = useSharedValue(0);
  const isFinishingPan = useSharedValue(false);
  const isActive = useSharedValue(false);

  const pan = useMemo(() => {
    return Gesture.Pan()
      .manualActivation(true)
      .maxPointers(1)
      .activeCursor("grabbing")
      .onBegin((e) => {
        startPos.value = { x: e.absoluteX, y: e.absoluteY };
        oldY.value = store.state.y.value;
      })
      .onTouchesMove((e, state) => {
        "worklet";
        if (!e.allTouches[0] || isActive.value) {
          return;
        }

        const moveY = startPos.value.y - e.allTouches[0].absoluteY;
        const moveX = startPos.value.x - e.allTouches[0].absoluteX;
        if (Math.abs(moveY) < 5 && Math.abs(moveX) < 5) {
          return;
        }

        const gestureDirection =
          e.allTouches[0].absoluteY - startPos.value.y > 0 ? "down" : "up";
        if (panConfig.onStartShouldSetPanResponder(gestureDirection)) {
          // Prevent scroll
          isActive.value = true;
          state.activate();
        } else {
          isActive.value = false;
          state.fail();
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
          if (!store.config.panDownToClose) {
            changeY = changeY / overDragResistanceFactor;
          }
        }

        // if detached and centered double the changeY so it feels more natural
        if (
          store.config.position[0] === "center" &&
          store.config.detached &&
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
          store.config.panDownToClose ? -1 : 0,
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
          if (store.state.y.value <= store.config.closeY) {
            store.state.visibilityPercentage.value = 0;
          }

          isFinishingPan.value = false;
        };

        const newHeight = relevantSnapPoints[newSnapPointIndex];
        store.state.snapPointIndex.value = newSnapPointIndex;

        switch (mode) {
          case "close":
            store.state.y.value = withSpring(
              store.config.closeY,
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
  }, [isActive, startPos, oldY, store, panConfig, isFinishingPan]);

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
