import { useContext, useEffect, useMemo, useRef } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { defaultAttachedOffset, defaultProps } from '../constants';
import { SheetModalDefaultsContext } from '../context';
import { SheetModalConfig, SheetModalWithChildren } from '../types';

function usePropsToConfig(props: SheetModalWithChildren) {
  const context = useContext(SheetModalDefaultsContext);
  const lastReturnValue = useRef<SheetModalConfig>();

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
      ...defaultProps.closeButtonStyle,
      ...context.closeButtonStyle,
      ...props.closeButtonStyle,
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

    // check if any key is changed
    let hasChanged = false;
    let key: keyof SheetModalConfig;
    for (key in config) {
      if (!lastReturnValue.current) {
        hasChanged = true;
        break;
      } else if (lastReturnValue.current[key] !== config[key]) {
        if (typeof config[key] === 'object') {
          if (JSON.stringify(lastReturnValue.current[key]) !== JSON.stringify(config[key])) {
            hasChanged = true;
            break;
          }
        } else {
          hasChanged = true;
        }
      }

      if (hasChanged) {
        break;
      }
    }

    if (hasChanged) {
      lastReturnValue.current = config;
    }

    return lastReturnValue.current!;
  }, [context, props]);

  const sharedProps = useSharedValue(returnValue);

  useEffect(() => {
    sharedProps.value = returnValue;
  }, [returnValue, sharedProps]);

  return sharedProps;
}

export default usePropsToConfig;

function sanitizeProps(props: Partial<SheetModalConfig>): Partial<SheetModalConfig> {
  const allowedKeys = [
    'closeY',
    'detached',
    'position',
    'offset',
    'minHeight',
    'autoShrink',
    'snapPoints',
    'snapPointIndex',
    'containerStyle',
    'closeButtonStyle',
    'headerStyle',
    'panContent',
    'withFocusTrap',
    'withClosebutton',
    'withBackdrop',
    'panDownToClose',
    'closeButtonComponent',
    'backdropComponent',
    'handleComponent',
    'onClosed',
    'onOpened',
    'onSnapPointChanged',
    'animateOnMount',
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
