import { useMemo } from 'react';
import { useAnimatedStyle } from 'react-native-reanimated';
import { DefaultStyle } from 'react-native-reanimated/lib/typescript/reanimated2/hook/commonTypes';

const useStableAnimatedStyle = (cb: () => DefaultStyle, deps: Array<any>) => {
  const style = useAnimatedStyle(cb, deps);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => style, deps);
};

export default useStableAnimatedStyle;
