import React, { useCallback } from 'react';
import { Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView, useSheetModal } from '../src';
import { snapPoints } from './const';
import { styles } from './styles';

type Props = {
  title: string;
};

export default function SheetModalContent(props: Props): React.JSX.Element {
  const currentModal = useSheetModal();

  const onClose = useCallback(() => {
    console.log('Closing');
    currentModal.close(() => {
      console.log('Closed');
    });
  }, [currentModal]);

  return (
    <View
      style={[
        styles.sheet,
        {
          height: '100%',
        },
      ]}
    >
      <Text style={{ padding: 16 }}>{props.title}</Text>
      <Button
        title="Close"
        onPress={onClose}
      />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 35,
        }}
        alwaysBounceVertical={false}
      >
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
                {index < snapPoints.length && <Text style={{ color: 'white' }}>Snap {index}</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TextInput
          placeholder="search"
          ref={currentModal.autoFocus}
        />

        <View style={styles.rectContainer}>
          {Array.from({ length: 200 }).map((_, index) => (
            <View
              style={styles.rect}
              key={index}
            >
              <Text>Item {index}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
