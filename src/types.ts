import { AnimatedStyle, SharedValue } from "react-native-reanimated";
import { PropsWithChildren, ReactNode } from "react";
import { FlexAlignType, StyleProp, ViewStyle } from "react-native";

export type SnapPoint = string | number;
export type Offset = [y: number, x: number];
export type Position = [
  y: "bottom" | "center" | "top",
  x: "left" | "center" | "right"
];

export type SheetModalWithChildren = PropsWithChildren<SheetModalProps>;

export type SheetModalProps = {
  handleComponent?: () => ReactNode;
  backdropComponent?: () => ReactNode;
  closeButtonComponent?: () => ReactNode;
  onClosed?: () => void;
  onOpened?: () => void;

  containerStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  headerStyle?: StyleProp<ViewStyle>;
  closeButtonStyle?: {
    iconColor?: StyleProp<ViewStyle["backgroundColor"]>;
    backgroundColor?: StyleProp<ViewStyle["backgroundColor"]>;
  };
  handleStyle?: StyleProp<ViewStyle>;

  /**
   * Animate the sheet modal when it mounts
   * Defaults to true
   */
  animateOnMount?: boolean;

  /**
   * Close the sheet modal when pressing the escape key on the web
   * Defaults to true
   */
  closeOnEscape?: boolean;

  /**
   * Render a close button in the header
   * Defaults to true
   */
  withClosebutton?: boolean;

  /**
   * Render a backdrop behind the sheet modal
   * Defaults to true
   */
  withBackdrop?: boolean;

  /**
   * Trap focus inside the sheet modal
   * Defaults to true
   */
  withFocusTrap?: boolean;

  /**
   * Array of snappoints for the sheet modal, in pixels (number) or percentage (string). If a snapPoint is greater than the content height, the sheet modal will not expand beyond the actual content size.
   * Defaults to [350, "70%"]
   */
  snapPoints?: SnapPoint[];

  /**
   * Initial snap index. Provide -1 to initiate sheet in closed state
   * Defaults to -1
   */
  snapPointIndex?: number;

  /**
   * Allow panning down to close the sheet modal
   * Defaults to true
   */
  panDownToClose?: boolean;

  /**
   * Allow panning the content of the sheet modal, when false and panDownToClose is true, only the handle can be used to pan
   * Defaults to true
   */
  panContent?: boolean;

  /**
   * Minimum height of the sheet modal
   * Defaults to 50
   */
  minHeight?: number;

  /**
   * Y position of the sheet modal when closed, should be something (0 - shadow size)
   * Defaults to -50
   */
  closeY?: number;

  /**
   * Automaticaly resize the sheet modal to the nearest snapp point when content is smaller than the current snap point
   * Defaults to true
   */
  autoResize?: boolean;

  /**
   * Detach the sheet modal from the bottom of the screen
   * Defaults to false
   */
  detached?: boolean;

  /**
   * Position of the sheet modal, [vertical, horizontal]
   * Defaults to ["center", "center"]
   */
  position?: Position;

  /**
   * Offset from the screen, [vertical, horizontal]
   * Defaults to [50, 30]
   */
  offset?: Offset;
};

export type SheetModalMethods = {
  /**
   * Close the sheet modal
   */
  close: () => void;

  /**
   * Snap the sheet modal to a specific SnapPoint index
   */
  snapToIndex: (index: number, animate?: boolean) => void;

  /**
   * Check if the sheet modal is closed
   */
  isClosed: () => boolean;
};

export type SheetModalConfig = Required<SheetModalProps>;

export type SheetModalStore = {
  id: string;

  config: SheetModalConfig;

  state: {
    height: SharedValue<number>;
    y: SharedValue<number>;
    snapPoints: SharedValue<number[]>;
    snapPointIndex: SharedValue<number>;
    visibilityPercentage: SharedValue<number>;
    contentLayout: SharedValue<{ width: number; height: number }>;
    isPanning: SharedValue<boolean>;
    isClosed: SharedValue<boolean>;
    isActive: SharedValue<boolean>;
  };

  /**
   * Set the content layout
   */
  onContentLayout: (w: number, h: number) => void;

  /**
   * returns next SnapPoint index based on the y position
   */
  getNextSnapPointIndex: (snapPoints: number[], y: number) => number;

  /**
   * returns previous SnapPoint index based on the y position
   */
  getPreviousSnapPointIndex: (snapPoints: number[], y: number) => number;

  /**
   * returns the y position for a given SnapPoint index
   */
  getYForHeight: (h: number) => number;

  /**
   * Set the focus on a node
   */
  autoFocus: (node: unknown) => void;

  /**
   * Close the sheet modal
   */
  close: SheetModalMethods["close"];

  /**
   * Snap the sheet modal to a specific SnapPoint index
   */
  snapToIndex: SheetModalMethods["snapToIndex"];
};

export type ContentLayout = {
  width: number;
  height: number;
};

export type PanConfig = {
  onStartShouldSetPanResponder: (gestureDirection: PanDirection) => boolean;
};

export type PanDirection = "up" | "down";

export type ContentAnimationStyle = {
  transform: any;
  alignSelf: FlexAlignType;
  borderBottomLeftRadius: number;
  borderBottomRightRadius: number;
  marginLeft: number;
  marginRight: number;
  height?: number;
  maxWidth?: number;
  visibility: "hidden" | "visible";
};

export type SheetModalInstanceMethods = SheetModalMethods & {
  isClosed: () => boolean;
};
