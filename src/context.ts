import { createContext } from "react";
import { SheetModalConfig, SheetModalStore } from "./types";

// Context for sheets
const SheetModalContext = createContext<SheetModalStore>({} as any);
export default SheetModalContext;

// Context for defaults
export const SheetModalDefaultsContext = createContext<SheetModalConfig>(
  {} as any
);
