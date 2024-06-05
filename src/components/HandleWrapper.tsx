import { useState } from "react";
import useSheetModal from "../hooks/useSheetModal";
import { useAnimatedReaction, runOnJS } from "react-native-reanimated";

function HandleWrapper() {
  const store = useSheetModal();
  const [showHandle, setShowHandle] = useState(false);

  useAnimatedReaction(
    () => store.state.snapPoints.value,
    (snapPoints) => {
      runOnJS(setShowHandle)(snapPoints.length > 1);
    },
    [store.state.snapPoints]
  );

  return showHandle && store.config.handleComponent?.();
}

export default HandleWrapper;
