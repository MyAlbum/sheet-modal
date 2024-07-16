import { createContext, useContext } from 'react';
import { SharedValue } from 'react-native-reanimated';

export type WindowSize = SharedValue<{ width: number; height: number }>;

// Context for defaults
export const WindowContext = createContext<WindowSize>({} as WindowSize);

function useWindowDimensions() {
  return useContext(WindowContext);
}

export default useWindowDimensions;
