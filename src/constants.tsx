import SheetModalCloseButton from "./components/CloseButton";
import SheetHandle from "./components/Handle";
import { SheetModalProps } from "./types";
import React from "react";
import { StyleSheet, View } from "react-native";

// spring animation config used for snapping the sheet modal
export const AniConfig = {
  damping: 100,
  stiffness: 700,
  mass: 2,
};

const styleSheet = StyleSheet.create({
  container: {
    backgroundColor: "#232323",
    borderRadius: 16,

    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowRadius: 25,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 2,
  },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    flexDirection: "column",
    alignItems: "flex-end",
    transform: "translate3d(0,0,0)",
  },

  handle: {
    height: 3,
    top: 5,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    width: 35,
    alignSelf: "center",
    borderRadius: 100,
    position: "absolute",
  },
});

// Breakpoint to switch between detached and attached sheetmodal
export const detachBreakpoint = 500;

// Factor to make it harder to pan when out of bounds
export const overDragResistanceFactor = 5;

export const defaultProps: Required<SheetModalProps> = {
  withClosebutton: true,
  withBackdrop: true,
  panDownToClose: true,
  panContent: true,
  autoResize: true,
  closeOnEscape: true,
  animateOnMount: true,

  snapPoints: ["100%"],
  snapPointIndex: -1,
  offset: [50, 30],
  minHeight: 50,
  position: ["center", "center"],

  detached: false,

  backdropComponent: () => (
    <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }} />
  ),
  handleComponent: () => <SheetHandle />,
  closeButtonComponent: () => <SheetModalCloseButton />,

  containerStyle: styleSheet.container,
  headerStyle: styleSheet.header,
  closeButtonStyle: {
    iconColor: "rgba(155, 155, 155, 1)",
    backgroundColor: "#353738",
  },
  handleStyle: styleSheet.handle,

  closeY: -50,
};

export const defaultAttachedOffset: Required<SheetModalProps>["offset"] = [
  65, 0,
];
