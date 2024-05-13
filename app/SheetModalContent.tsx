import React from "react";
import { useSheetModal } from "../src";
import { styles } from "./styles";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { snapPoints } from "./const";

type Props = {
  title: string;
};

export default function SheetModalContent(props: Props): React.JSX.Element {
  const currentModal = useSheetModal();

  return (
    <View style={styles.sheet}>
      <Text style={{ padding: 16 }}>{props.title}</Text>
      <ScrollView
        horizontal
        style={styles.scrollView}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.circleContainer}>
          {Array.from({ length: 10 }).map((_, index) => (
            <TouchableOpacity
              key={`sheet-circle-${index}`}
              onPress={() => {
                if (index < snapPoints.length) {
                  currentModal.snapToIndex(index);
                }
              }}
              style={styles.circle}
            >
              {index < snapPoints.length && (
                <Text style={{ color: "white" }}>Snap {index}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.rectContainer}>
        {Array.from({ length: 200 }).map((_, index) => (
          <View style={styles.rect} key={index}>
            <Text>Item {index}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
