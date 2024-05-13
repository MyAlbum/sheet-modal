import { createContext, useContext } from "react";

export type WindowSize = {
  width: number;
  height: number;
};

// Context for defaults
export const WindowContext = createContext({ width: 0, height: 0 });

function useWindowDimensions() {
  return useContext(WindowContext);
}

export default useWindowDimensions;
