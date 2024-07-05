import {
  PortalHost,
  SheetModal,
  SheetModalMethods,
  SheetModalProvider,
} from "../src";
import React, { useCallback, useRef } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { closeButtonStyle, styles } from "./styles";
import { detachedSnapPoints, snapPoints } from "./const";
import SheetModalContent from "./SheetModalContent";
import SheetCustomizer from "./SheetCustomizer";

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ ...styles.flex, ...styles.background }}>
      <View style={styles.flex}>
        <PortalHost>
          <SheetModalProvider
            containerStyle={styles.container}
            handleStyle={styles.handle}
            closeButtonStyle={closeButtonStyle}
          >
            <Content />
          </SheetModalProvider>
        </PortalHost>
      </View>
    </GestureHandlerRootView>
  );
}

function Content(): React.JSX.Element {
  const windowSize = useWindowDimensions();
  const isDetached = windowSize.width > 700;

  const attachedSheetModalRef = useRef<SheetModalMethods>(null);
  const detachedSheetModalRef = useRef<SheetModalMethods>(null);
  const responsiveSheetModalRef = useRef<SheetModalMethods>(null);

  const openAttachedModal = useCallback(() => {
    attachedSheetModalRef.current?.snapToIndex(0);
  }, []);

  const openDetachedModal = useCallback(() => {
    detachedSheetModalRef.current?.snapToIndex(0);
  }, []);

  const openResponsiveModal = useCallback(() => {
    responsiveSheetModalRef.current?.snapToIndex(0);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <View style={{ ...styles.flex, ...styles.center }}>
          <View>
            <Pressable
              onPress={openAttachedModal}
              style={styles.button}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Text>Open attached</Text>
            </Pressable>

            <Pressable
              onPress={openDetachedModal}
              style={styles.button}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Text>Open detached</Text>
            </Pressable>

            <Pressable
              onPress={openResponsiveModal}
              style={styles.button}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Text>Open responsive</Text>
            </Pressable>
          </View>
          <View style={styles.hairline} />
          <View>
            <SheetCustomizer />
          </View>

          <SheetModal
            ref={attachedSheetModalRef}
            snapPoints={snapPoints}
            detached={false}
            onClosed={() => {
              console.log("closed");
            }}
            onOpened={() => {
              console.log("opened");
            }}
          >
            <SheetModalContent title={"Sheet modal attached to bottom"} />
          </SheetModal>

          <SheetModal
            ref={detachedSheetModalRef}
            snapPoints={detachedSnapPoints}
            detached={true}
            position={["bottom", "left"]}
            offset={[50, 30]}
            withBackdrop={false}
            withFocusTrap={false}
          >
            <SheetModalContent title={"Floating sheet modal"} />
          </SheetModal>

          <SheetModal
            ref={responsiveSheetModalRef}
            snapPoints={isDetached ? detachedSnapPoints : snapPoints}
            detached={isDetached}
          >
            <SheetModalContent title={"Responsive sheet modal"} />
          </SheetModal>

          <SheetModal
            snapPoints={["50%", "80%", "100%"]}
            detached={true}
            position={["bottom", "left"]}
            offset={[50, 30]}
            withBackdrop={false}
            snapPointIndex={0}
            animateOnMount={false}
            withFocusTrap={false}
            autoResize={false}
            panDownToClose={false}
            panContent={false}
          >
            <SheetModalContent title={"This modal is opened on mount"} />
          </SheetModal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
