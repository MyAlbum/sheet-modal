import { useContext, useMemo } from "react";
import { SheetModalDefaultsContext } from "../context";
import { SheetModalConfig, SheetModalWithChildren } from "../types";
import { defaultAttachedOffset, defaultProps } from "../constants";
import useSheetModal from "./useSheetModal";

function useSheetModalConfigInternal(_props: SheetModalWithChildren) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, ...props } = _props;
  const store = useSheetModal();
  const context = useContext(SheetModalDefaultsContext);
  const sheetModalConfig = useMemo<SheetModalConfig>(() => {
    const dataStore = { ...defaultProps };

    return new Proxy(dataStore, {
      get(target, name) {
        // @ts-ignore
        return target[name];
      },

      set(target, name, value) {
        // @ts-ignore
        target[name] = value;
        return true;
      },
    });
  }, []);

  const closeButtonStyle = useMemo(() => {
    return {
      ...(defaultProps.closeButtonStyle as {}),
      ...(context.closeButtonStyle as {}),
      ...(props.closeButtonStyle as {}),
    };
  }, [context.closeButtonStyle, props.closeButtonStyle]);

  const containerStyle = useMemo(() => {
    return {
      ...(defaultProps.containerStyle as {}),
      ...(context.containerStyle as {}),
      ...(props.containerStyle as {}),
    };
  }, [context.containerStyle, props.containerStyle]);

  const headerStyle = useMemo(() => {
    return {
      ...(defaultProps.headerStyle as {}),
      ...(context.headerStyle as {}),
      ...(props.headerStyle as {}),
    };
  }, [context.headerStyle, props.headerStyle]);

  const handleStyle = useMemo(() => {
    return {
      ...(defaultProps.handleStyle as {}),
      ...(context.handleStyle as {}),
      ...(props.handleStyle as {}),
    };
  }, [context.handleStyle, props.handleStyle]);

  const returnValue = useMemo<SheetModalConfig>(() => {
    const userConfig = {
      ...context,
      ...props,
    };

    const config: SheetModalConfig = {
      ...defaultProps,
      ...userConfig,
    };

    config.containerStyle = containerStyle;
    config.headerStyle = headerStyle;
    config.handleStyle = handleStyle;
    config.closeButtonStyle = closeButtonStyle;

    if (userConfig.offset === undefined) {
      if (!config.detached) {
        config.offset = defaultAttachedOffset;
      }
    }

    Object.assign(sheetModalConfig, config);

    return sheetModalConfig;
  }, [
    context,
    props,
    containerStyle,
    headerStyle,
    handleStyle,
    closeButtonStyle,
    sheetModalConfig,
  ]);

  if (Object.keys(store).length > 0) {
    console.trace(
      "SheetModalDefaultsProvider cannot be used within the sheetModal, use store.config instead"
    );
  }

  return returnValue;
}

export default useSheetModalConfigInternal;
