import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView, useSheetModal } from '../src';
import { styles } from './styles';

export default function SheetModalDynamicContent(): React.JSX.Element {
  const currentModal = useSheetModal();
  const [count, setCount] = React.useState('200');
  const [itemCount, setItemCount] = React.useState(parseInt(count, 10));

  const updateItemCount = React.useCallback(() => {
    const c = parseInt(count.toString(), 10);
    if (isNaN(c) || c < 0) {
      setItemCount(200);
    } else {
      setItemCount(c);
    }
  }, [count]);

  return (
    <View style={styles.sheet}>
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
                if (index < currentModal.config.value.snapPoints.length) {
                  currentModal.snapToIndex(index);
                }
              }}
              style={styles.circle}
            >
              {index < currentModal.config.value.snapPoints.length && <Text style={{ color: 'white' }}>Snap {index}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TextInput
        value={count}
        onChangeText={(c) => setCount(c)}
        onBlur={updateItemCount}
        style={{ ...styles.input, marginHorizontal: 16 }}
      />
      <View style={styles.rectContainer}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <View
            style={styles.rect}
            key={index}
          >
            <Text>Item {index}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
