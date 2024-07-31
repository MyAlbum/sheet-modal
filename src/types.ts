import { PropsWithChildren, ReactNode } from 'react';
import { FlexAlignType, StyleProp, ViewStyle } from 'react-native';
import { AnimatedStyle, SharedValue } from 'react-native-reanimated';

export type SnapPoint = string | number;
export type Offset = [y: number, x: number];
export type Position = [y: 'bottom' | 'center' | 'top', x: 'left' | 'center' | 'right'];

export type SheetModalProviderProps = Partial<SheetModalConfig>;

export type SheetModalWithChildren = PropsWithChildren<Partial<SheetModalConfig>>;

export type SheetModalConfig = {
  /**
   * Animate the sheet modal when it mounts
   * Defaults to true
   */
  animateOnMount: boolean;

  /**
   * Y position of the sheet modal when closed, should be something (0 - shadow size)
   * Defaults to -50
   */
  closeY: number;

  /**
   * Detach the sheet modal from the bottom of the screen
   * Defaults to false
   */
  detached: boolean;

  /**
   * Position of the sheet modal, [vertical, horizontal]
   * Defaults to ["center", "center"]
   */
  position: Position;

  /**
   * Offset from the screen, [vertical, horizontal]
   * Defaults to [50, 30]
   */
  offset: Offset;

  /**
   * Custom style for the container
   */
  containerStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;

  /**
   * Custom style for the content
   */
  headerStyle: StyleProp<ViewStyle>;

  /**
   * Custom style for the handle
   */
  handleStyle?: StyleProp<ViewStyle>;

  /**
   * Custom colors for the close button
   */
  closeButtonStyle?: {
    iconColor?: StyleProp<ViewStyle['backgroundColor']>;
    backgroundColor?: StyleProp<ViewStyle['backgroundColor']>;
  };

  /**
   * Automaticaly resize the sheet modal to the nearest snapp point when content is smaller than the current snap point
   * Defaults to true
   */
  autoResize: boolean;

  /**
   * Minimum height of the sheet modal
   * Defaults to 50
   */
  minHeight: number;

  /**
   * Array of snappoints for the sheet modal, in pixels (number) or percentage (string). If a snapPoint is greater than the content height, the sheet modal will not expand beyond the actual content size.
   * Defaults to [350, "70%"]
   */
  snapPoints: SnapPoint[];

  /**
   * Initial snap index. Provide -1 to initiate sheet in closed state
   * Defaults to -1
   */
  snapPointIndex: number;

  /**
   * Allow panning the content of the sheet modal, when false and panDownToClose is true, only the handle can be used to pan
   * Defaults to true
   */
  panContent: boolean;

  /**
   * Allow panning down to close the sheet modal
   * Defaults to true
   */
  panDownToClose: boolean;

  /**
   * Trap focus inside the sheet modal
   * Defaults to true
   */
  withFocusTrap: boolean;

  /**
   * Render a close button in the header
   * Defaults to true
   */
  withClosebutton: boolean;

  /**
   * Render a custom handle component
   */
  handleComponent?: () => ReactNode;

  /**
   * Render a custom backdrop
   */
  backdropComponent?: () => ReactNode;

  /**
   * Render a custom close button
   */
  closeButtonComponent?: () => ReactNode;

  /**
   * Callback when the sheet modal is closed
   */
  onClosed?: () => void;

  /**
   * Callback when the sheet modal is opened
   */
  onOpened?: () => void;

  /**
   * Render a backdrop behind the sheet modal
   * Defaults to true
   */
  withBackdrop: boolean;
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
   * Set the props of the sheet modal
   */
  setProps: (props: SheetModalWithChildren) => void;

  /**
   * Check if the sheet modal is closed
   */
  isClosed: () => boolean;
};

export type SheetModalStore = {
  id: string;

  config: SharedValue<SheetModalConfig>;

  state: {
    contentLayout: SharedValue<{ width: number; height: number }>;
    height: SharedValue<number>;
    isActive: SharedValue<boolean>;
    isClosed: SharedValue<boolean>;
    isMounted: SharedValue<boolean>;
    isPanning: SharedValue<boolean>;
    snapPointIndex: SharedValue<number>;
    snapPoints: SharedValue<number[]>;
    visibilityPercentage: SharedValue<number>;
    y: SharedValue<number>;
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
  close: SheetModalMethods['close'];

  /**
   * Snap the sheet modal to a specific SnapPoint index
   */
  snapToIndex: SheetModalMethods['snapToIndex'];
};

export type ContentLayout = {
  width: number;
  height: number;
};

export type PanConfig = {
  onStartShouldSetPanResponder: (data: PanData) => boolean;
};

export type PanData = {
  direction: PanDirection;
  startY: number;
};

export type PanDirection = 'up' | 'down' | 'unknown';

export type ContentAnimationStyle = {
  transform: any;
  alignSelf: FlexAlignType;
  marginLeft: number;
  marginRight: number;
  height?: number;
  width: number;
  maxWidth?: number;
  visibility: 'hidden' | 'visible';
};
