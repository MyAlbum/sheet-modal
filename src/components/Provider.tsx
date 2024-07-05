import React, { PropsWithChildren, useCallback, useContext } from "react";
import { SheetModalDefaultsContext } from "../context";
import { SheetModalConfig } from "../types";
import { LayoutChangeEvent, View } from "react-native";
import { WindowContext } from "../hooks/useWindowDimensions";
import { useSharedValue } from "react-native-reanimated";

function SheetModalProvider(_props: PropsWithChildren<SheetModalConfig>) {
  const parentContext = useContext(SheetModalDefaultsContext);
  const { children, ...props } = _props;
  const windowDimensions = useSharedValue({ width: 0, height: 0 });

  const onWindowResize = useCallback(
    (e: LayoutChangeEvent) => {
      windowDimensions.value = {
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height,
      };
    },
    [windowDimensions]
  );

  return (
    <SheetModalDefaultsContext.Provider
      value={{
        ...parentContext,
        ...props,
      }}
    >
      <View
        onLayout={onWindowResize}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
        }}
      />

      <WindowContext.Provider value={windowDimensions}>
        {children}
      </WindowContext.Provider>
    </SheetModalDefaultsContext.Provider>
  );
}

export default SheetModalProvider;
