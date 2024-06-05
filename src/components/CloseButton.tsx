import React, { useCallback } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import useSheetModal from "../hooks/useSheetModal";

export default function SheetModalCloseButton() {
  const store = useSheetModal();

  const circleStyle: StyleProp<ViewStyle> = [stylesheet.circle];
  if (store.config.closeButtonStyle?.backgroundColor) {
    // @ts-ignore
    circleStyle.push({
      backgroundColor: store.config.closeButtonStyle.backgroundColor,
    });
  }

  const iconStyle: StyleProp<ViewStyle> = [];
  if (store.config.closeButtonStyle?.iconColor) {
    // @ts-ignore
    iconStyle.push({
      backgroundColor: store.config.closeButtonStyle?.iconColor,
    });
  }

  const onPress = useCallback(() => {
    store.close();
  }, [store]);

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ foreground: true, borderless: true }}
      style={stylesheet.container}
      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
    >
      <View style={circleStyle}>
        <View style={[stylesheet.x, stylesheet.x1, ...iconStyle]} />
        <View style={[stylesheet.x, stylesheet.x2, ...iconStyle]} />
      </View>
    </Pressable>
  );
}

const stylesheet = StyleSheet.create({
  container: {
    top: 15,
    right: 15,
    overflow: "hidden",
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: "hidden",
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
