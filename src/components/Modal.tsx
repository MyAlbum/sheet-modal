import React, {
  ReactElement,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  SheetModalMethods,
  SheetModalInstanceMethods,
  SheetModalWithChildren,
} from "../types";
import SheetModalInstance from "./ModalInstance";

const SheetModal = forwardRef<SheetModalMethods, SheetModalWithChildren>(
  (_props, ref) => {
    const refs = useRef<Array<SheetModalInstanceMethods | null>>([]);
    const [instances, setInstances] = useState<ReactElement[]>([]);

    const close = useCallback(() => {
      const activeInstance = refs.current.at(-1);
      activeInstance?.close();
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
              {..._props}
              ref={(r) => {
                refs.current[c.length] = r;
              }}
              snapPointIndex={index}
            />,
          ]);
        }

        return null;
      },
      [_props]
    );

    useImperativeHandle(ref, () => ({
      close,
      snapToIndex,
    }));

    return <>{instances}</>;
  }
);

SheetModal.displayName = "SheetModal";
export default SheetModal;
