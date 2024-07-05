import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import type { SheetModalMethods, SheetModalWithChildren } from "../types";
import SheetModalContext from "../context";
import SheetModalBackdrop from "./Backdrop";
import SheetModalContent from "./Content";
import useSheetModalConfigInternal from "../hooks/useSheetModalInternal";
import PortalComponent from "./Portal/Portal";
import useSheetModalInit from "../lib/store";
import useSharedState from "../hooks/useSharedState";
import useWindowDimensions, {
  WindowContext,
} from "../hooks/useWindowDimensions";
import { useEventsToProps } from "../hooks/useEventsToProps";

const SheetModalInstance = forwardRef<
  SheetModalMethods,
  SheetModalWithChildren
>((props, ref) => {
  const config = useSheetModalConfigInternal(props);
  const store = useSheetModalInit(config);
  const isMounted = useSharedState(store.state.isMounted);
  const windowDimensions = useWindowDimensions();

  const isClosed = useCallback(() => {
    return store.state.isClosed.value;
  }, [store.state.isClosed]);

  useEffect(() => {
    // Snap to initial snap point on mount
    if (props.snapPointIndex !== undefined && props.snapPointIndex >= 0) {
      store.snapToIndex(props.snapPointIndex, props.animateOnMount);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    close: store.close,
    snapToIndex: store.snapToIndex,
    isClosed,
  }));

  useEventsToProps(store);

  if (!isMounted) {
    return null;
  }

  return (
    <PortalComponent>
      <WindowContext.Provider value={windowDimensions}>
        <SheetModalContext.Provider value={store}>
          <SheetModalBackdrop />
          <SheetModalContent>{props.children}</SheetModalContent>
        </SheetModalContext.Provider>
      </WindowContext.Provider>
    </PortalComponent>
  );
});

SheetModalInstance.displayName = "SheetModalInstance";
export default SheetModalInstance;
