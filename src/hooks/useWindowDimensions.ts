import { createContext, useContext } from "react";
import { SharedValue } from "react-native-reanimated";

export type WindowSize = SharedValue<{ width: number; height: number }>;

// Context for defaults
export const WindowContext = createContext({ value: { width: 0, height: 0 } });

function useWindowDimensions() {
  return useContext(WindowContext);
}

export default useWindowDimensions;
