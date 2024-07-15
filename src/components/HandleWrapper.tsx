import { useState } from 'react';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import useSharedState from '../hooks/useSharedState';
import useSheetModal from '../hooks/useSheetModal';

function HandleWrapper() {
  const store = useSheetModal();
  const [showHandle, setShowHandle] = useState(false);
  const config = useSharedState(store.config);

  useAnimatedReaction(
    () => store.state.snapPoints.value,
    (snapPoints) => {
      runOnJS(setShowHandle)(snapPoints.length > 1);
    },
    [store.state.snapPoints]
  );

  return showHandle && config.handleComponent?.();
}

export default HandleWrapper;
