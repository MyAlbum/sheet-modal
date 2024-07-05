import React from "react";
import useSheetModal from "../hooks/useSheetModal";
import Animated from "react-native-reanimated";
import useStableAnimatedStyle from "../hooks/useStableAnimatedStyle";
import useSharedState from "../hooks/useSharedState";

function SheetModalBackdrop() {
  const store = useSheetModal();
  const config = useSharedState(store.config);

  const style = useStableAnimatedStyle(() => {
    "worklet";

    if (store.state.visibilityPercentage.value === 0) {
      return {
        display: "none",
      };
    }

    return {
      opacity: store.state.visibilityPercentage.value,
      pointerEvents:
        store.state.visibilityPercentage.value > 0.3 ? "auto" : "none",
      display: "flex",
    };
  }, [store.state.visibilityPercentage]);

  if (!config.withBackdrop) {
    return null;
  }

  return (
    <Animated.View
      style={[
        {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          position: "absolute",
        },
        style,
      ]}
      testID={`${store.id}-backdrop`}
    >
      {config.backdropComponent?.()}
    </Animated.View>
  );
}

export default SheetModalBackdrop;
