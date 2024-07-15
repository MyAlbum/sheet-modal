import React, { ReactElement, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { SheetModalMethods, SheetModalWithChildren } from '../types';
import SheetModalInstance from './ModalInstance';

const SheetModal = forwardRef<SheetModalMethods, SheetModalWithChildren>((props, ref) => {
  const refs = useRef<Array<SheetModalMethods | null>>([]);
  const [instances, setInstances] = useState<ReactElement[]>(
    (() => {
      const isVisibleOnMount = props.snapPointIndex !== undefined && props.snapPointIndex >= 0;

      if (isVisibleOnMount) {
        return [
          <SheetModalInstance
            key={0}
            {...props}
            ref={(r) => {
              refs.current[0] = r;
            }}
          />,
        ];
      }

      return [];
    })()
  );

  const close = useCallback(() => {
    const activeInstance = refs.current.at(-1);
    activeInstance?.close();
  }, []);

  const setProps = useCallback((newProps: SheetModalWithChildren) => {
    const activeInstance = refs.current.at(-1);
    activeInstance?.setProps(newProps);
  }, []);

  const isClosed = useCallback(() => {
    return refs.current.at(-1)?.isClosed() ?? false;
  }, []);

  const snapToIndex = useCallback(
    (index: number) => {
      if (index < 0) {
        console.warn(`Snap point index ${index} is out of range`);
        return;
      }

      const activeInstance = refs.current.at(-1);
      if (activeInstance && !activeInstance.isClosed()) {
        activeInstance.snapToIndex(index);
      } else {
        setInstances((c) => [
          ...c,
          <SheetModalInstance
            key={c.length + 1}
            {...props}
            ref={(r) => {
              refs.current[c.length] = r;
            }}
            snapPointIndex={index}
          />,
        ]);
      }

      return null;
    },
    [props]
  );

  useEffect(() => {
    const activeInstance = refs.current.at(-1);
    if (activeInstance && !activeInstance.isClosed()) {
      activeInstance.setProps(props);
    }
  }, [props]);

  useImperativeHandle(ref, () => ({
    close,
    snapToIndex,
    isClosed,
    setProps,
  }));

  return <>{instances}</>;
});

SheetModal.displayName = 'SheetModal';
export default SheetModal;
