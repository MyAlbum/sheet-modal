import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import SheetModalContext from '../context';
import { useEventsToProps } from '../hooks/useEventsToProps';
import useSharedState from '../hooks/useSharedState';
import useWindowDimensions, { WindowContext } from '../hooks/useWindowDimensions';
import useCreateSheetModalStore from '../lib/store';
import type { SheetModalMethods, SheetModalWithChildren } from '../types';
import SheetModalBackdrop from './Backdrop';
import SheetModalContent from './Content';
import PortalComponent from './Portal/Portal';

const SheetModalInstance = forwardRef<SheetModalMethods, SheetModalWithChildren>((incomingProps, ref) => {
  const [props, setProps] = useState(incomingProps);
  const store = useCreateSheetModalStore(props);
  const isMounted = useSharedState(store.state.isMounted);
  const windowDimensions = useWindowDimensions();

  const isClosed = useCallback(() => {
    return store.state.isClosed.value;
  }, [store.state.isClosed]);

  useEffect(() => {
    // Snap to initial snap point on mount
    if (incomingProps.snapPointIndex !== undefined && incomingProps.snapPointIndex >= 0) {
      store.snapToIndex(incomingProps.snapPointIndex, incomingProps.animateOnMount);
    }

    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    close: store.close,
    snapToIndex: store.snapToIndex,
    setProps,
    isClosed,
  }));

  useEventsToProps(store);

  if (!isMounted) {
    return null;
  }

  return (
    <PortalComponent host={props.portalHostName ?? 'default'}>
      <WindowContext.Provider value={windowDimensions}>
        <SheetModalContext.Provider value={store}>
          <SheetModalBackdrop />
          <SheetModalContent>{props.children}</SheetModalContent>
        </SheetModalContext.Provider>
      </WindowContext.Provider>
    </PortalComponent>
  );
});

SheetModalInstance.displayName = 'SheetModalInstance';
export default SheetModalInstance;
