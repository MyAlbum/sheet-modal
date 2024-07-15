import { useContext, useEffect, useMemo } from "react";
import { SheetModalDefaultsContext } from "../context";
import { SheetModalConfig, SheetModalWithChildren } from "../types";
import { defaultAttachedOffset, defaultProps } from "../constants";
import { useSharedValue } from "react-native-reanimated";

function usePropsToConfig(props: SheetModalWithChildren) {
  const context = useContext(SheetModalDefaultsContext);

  const returnValue = useMemo<SheetModalConfig>(() => {
    const userConfig = {
      ...context,
      ...sanitizeProps(props),
    };

    const config: SheetModalConfig = {
      ...defaultProps,
      ...userConfig,
    };

    config.closeButtonStyle = {
      ...(defaultProps.closeButtonStyle as {}),
      ...(context.closeButtonStyle as {}),
      ...(props.closeButtonStyle as {}),
    };

    config.containerStyle = {
      ...(defaultProps.containerStyle as {}),
      ...(context.containerStyle as {}),
      ...(props.containerStyle as {}),
    };

    config.headerStyle = {
      ...(defaultProps.headerStyle as {}),
      ...(context.headerStyle as {}),
      ...(props.headerStyle as {}),
    };

    config.handleStyle = {
      ...(defaultProps.handleStyle as {}),
      ...(context.handleStyle as {}),
      ...(props.handleStyle as {}),
    };

    if (userConfig.offset === undefined) {
      if (!config.detached) {
        config.offset = defaultAttachedOffset;
      }
    }

    return config;
  }, [context, props]);

  const sharedProps = useSharedValue(returnValue);

  useEffect(() => {
    sharedProps.value = returnValue;
  }, [returnValue, sharedProps]);

  return sharedProps;
}

export default usePropsToConfig;

function sanitizeProps(
  props: Partial<SheetModalConfig>
): Partial<SheetModalConfig> {
  const allowedKeys = [
    "closeY",
    "detached",
    "position",
    "offset",
    "autoResize",
    "minHeight",
    "snapPoints",
    "snapPointIndex",
    "containerStyle",
    "closeButtonStyle",
    "headerStyle",
    "panContent",
    "withFocusTrap",
    "withClosebutton",
    "withBackdrop",
    "panDownToClose",
    "closeButtonComponent",
    "backdropComponent",
    "handleComponent",
    "onClosed",
    "onOpened",
    "animateOnMount",
  ];

  // Only allow keys that are in the allowedKeys array
  const propsCopy = { ...props };
  let key: keyof SheetModalConfig;
  for (key in props) {
    if (!allowedKeys.includes(key)) {
      delete propsCopy[key];
    }
  }

  return propsCopy;
}
