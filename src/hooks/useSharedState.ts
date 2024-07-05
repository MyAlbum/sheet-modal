import { useState } from "react";
import {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";

function useSharedState<T extends any>(v: SharedValue<T>) {
  const [state, setState] = useState<T>(v.value);

  useAnimatedReaction(
    () => v.value,
    (value) => {
      runOnJS(setState)(value);
    },
    [v]
  );

  return state;
}

export default useSharedState;
