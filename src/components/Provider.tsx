import React, { PropsWithChildren, useContext } from "react";
import { SheetModalDefaultsContext } from "../context";
import { SheetModalProps } from "../types";

function SheetModalProvider(_props: PropsWithChildren<SheetModalProps>) {
  const parentContext = useContext(SheetModalDefaultsContext);
  const { children, ...props } = _props;

  return (
    <SheetModalDefaultsContext.Provider
      value={{
        ...parentContext,
        ...props,
      }}
    >
      {children}
    </SheetModalDefaultsContext.Provider>
  );
}

export default SheetModalProvider;
