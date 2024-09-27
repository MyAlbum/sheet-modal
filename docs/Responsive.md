# Responsive SheetModal
Auto switch between attached/detached mode based on screensize.

```tsx
import React, { useRef } from 'react';
import { SheetModal, SheetModalMethods, ScrollView } from '@myalbum/sheet-modal';
import { useWindowDimensions, Pressable, Text, View } from "react-native";

function ResponsiveExample() {
  const windowDimensions = useWindowDimensions();
  const isDetached = (Math.min(windowDimensions.width, windowDimensions.height) > 700);
  const sheetModalRef = useRef<SheetModalMethods>(null);

  return (
    <>
      <Pressable
        onPress={() => {
          sheetModalRef.current?.present();
        }}
        style={{
          backgroundColor: 'red',
          padding: 10,
          borderRadius: 5,
          width: 250,
          alignItems: 'center',
        }}
      >
        <Text>open SheetModal</Text>
      </Pressable>

      <SheetModal
        ref={sheetModalRef}

        detached={isDetached}
        snapPoints={isDetached ? [600, "100%"] : [400, 600, "100%"]}
        position={isDetached ? ["bottom", "left"] : ["bottom", "center"]}
        withBackdrop={!isDetached}
      >
        <ScrollView>
          <View
            style={{
              width: isDetached ? 350 : 500,
              maxWidth: isDetached ? 500 : "100%",
            }}
          >
            <View
              style={{
                flex: 1,
                margin: 20,
                gap: 1,
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {
                Array.from({length: 40}).map((_, index) => (
                  <View
                    key={`item-${index}`}
                    style={{
                      padding: 20,
                      backgroundColor: '#211D25',
                    }}
                  />
                ))
              }
            </View>
          </View>
        <ScrollView>
      </SheetModal>
    </>
  )
}
```