import React, { useCallback } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import useSheetModal from "../hooks/useSheetModal";
import useSharedState from "../hooks/useSharedState";

export default function SheetModalCloseButton() {
  const store = useSheetModal();
  const config = useSharedState(store.config);

  const circleStyle: StyleProp<ViewStyle> = [stylesheet.circle];
  if (config.closeButtonStyle?.backgroundColor) {
    // @ts-ignore
    circleStyle.push({
      backgroundColor: config.closeButtonStyle.backgroundColor,
    });
  }

  const iconStyle: StyleProp<ViewStyle> = [];
  if (config.closeButtonStyle?.iconColor) {
    // @ts-ignore
    iconStyle.push({
      backgroundColor: config.closeButtonStyle?.iconColor,
    });
  }

  const onPress = useCallback(() => {
    store.close();
  }, [store]);

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ foreground: true, borderless: true }}
      style={circleStyle}
      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
    >
      <View style={[stylesheet.x, stylesheet.x1, ...iconStyle]} />
      <View style={[stylesheet.x, stylesheet.x2, ...iconStyle]} />
    </Pressable>
  );
}

const stylesheet = StyleSheet.create({
  circle: {
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: "hidden",
    position: "absolute",
    transform: "translate3d(0,0,0)",
  },
  x: {
    position: "absolute",
    width: 1.5,
    height: 12,
    borderRadius: 1,
    pointerEvents: "none",
  },
  x1: {
    transform: [{ rotate: "45deg" }],
    top: 9,
    left: 14,
  },
  x2: {
    transform: [{ rotate: "-45deg" }],
    top: 9,
    left: 14,
  },
});
