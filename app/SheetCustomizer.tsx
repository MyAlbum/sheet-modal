import SegmentedControl from '@react-native-segmented-control/segmented-control';
import React from 'react';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';
import { Offset, Position, SheetModal, SheetModalMethods } from '../src';
import SheetModalDynamicContent from './SheetModalDynamicContent';
import { styles } from './styles';

const positionVertical = ['top', 'center', 'bottom'];
const positionHorizontal = ['left', 'center', 'right'];

export default function SheetCustomizer() {
  const customSheetModalRef = React.useRef<SheetModalMethods>(null);

  const openCustomModal = React.useCallback(() => {
    customSheetModalRef.current?.snapToIndex(0);
  }, []);

  const [snapPointText, setSnapPointsText] = React.useState('300, 70%');
  const snapPoints = React.useMemo(() => {
    return snapPointText.split(',').map((point) => {
      if (point.includes('%')) {
        return point;
      }
      return parseInt(point, 10);
    });
  }, [snapPointText]);

  const [autoResize, setAutoResize] = React.useState(true);
  const [closeY, setCloseY] = React.useState(-50);
  const [detached, setDetached] = React.useState(false);
  const [minHeight, setMinHeight] = React.useState(50);
  const [offset, setOffset] = React.useState<Offset>([50, 30]);
  const [panContent, setPanContent] = React.useState(true);
  const [panDownToClose, setPanDownToClose] = React.useState(true);
  const [position, setPosition] = React.useState<Position>(['center', 'center']);
  const [withBackDrop, setWithBackdrop] = React.useState(true);
  const [withCloseButton, setWithCloseButton] = React.useState(true);

  return (
    <>
      <View style={styles.option}>
        <Text>Snap points</Text>
        <TextInput
          value={snapPointText}
          onChangeText={setSnapPointsText}
          style={styles.input}
        />
      </View>

      <View style={styles.option}>
        <Text>Auto resize</Text>
        <Switch
          value={autoResize}
          onValueChange={setAutoResize}
        />
      </View>

      <View style={styles.option}>
        <Text>Close Y</Text>
        <TextInput
          value={closeY.toString()}
          onChangeText={(text) => setCloseY(parseInt(text, 10))}
          style={styles.input}
        />
      </View>

      <View style={styles.option}>
        <Text>Detached</Text>
        <Switch
          value={detached}
          onValueChange={setDetached}
        />
      </View>

      <View style={styles.option}>
        <Text>Min height</Text>
        <TextInput
          value={minHeight.toString()}
          onChangeText={(text) => setMinHeight(parseInt(text, 10))}
          style={styles.input}
        />
      </View>

      <View style={styles.option}>
        <Text>Offset</Text>
        <View style={styles.row}>
          <TextInput
            value={offset[0].toString()}
            onChangeText={(text) => setOffset((o) => [parseInt(text, 10), o[1]])}
            style={{ ...styles.input, width: 50 }}
          />
          <Text> , </Text>
          <TextInput
            value={offset[1].toString()}
            onChangeText={(text) => setOffset((o) => [o[0], parseInt(text, 10)])}
            style={{ ...styles.input, width: 50 }}
          />
        </View>
      </View>

      <View style={styles.option}>
        <Text>Pan content</Text>
        <Switch
          value={panContent}
          onValueChange={setPanContent}
        />
      </View>

      <View style={styles.option}>
        <Text>Pan down to close</Text>
        <Switch
          value={panDownToClose}
          onValueChange={setPanDownToClose}
        />
      </View>

      <View
        style={{
          ...styles.option,
          ...{
            opacity: detached ? 1 : 0.4,
            pointerEvents: detached ? 'auto' : 'none',
          },
        }}
      >
        <Text>Position Vertical (only when detached)</Text>
        <SegmentedControl
          values={positionVertical}
          appearance="light"
          selectedIndex={positionVertical.indexOf(position[0])}
          onValueChange={(hpos) => {
            setPosition([hpos as Position[0], position[1]]);
          }}
        />
      </View>
      <View style={styles.option}>
        <Text>Position Horizontal</Text>
        <SegmentedControl
          values={positionHorizontal}
          appearance="light"
          selectedIndex={positionHorizontal.indexOf(position[1])}
          onValueChange={(vpos) => {
            setPosition([position[0], vpos as Position[1]]);
          }}
        />
      </View>

      <View style={styles.option}>
        <Text>With back drop</Text>
        <Switch
          value={withBackDrop}
          onValueChange={setWithBackdrop}
        />
      </View>

      <View style={styles.option}>
        <Text>With close button</Text>
        <Switch
          value={withCloseButton}
          onValueChange={setWithCloseButton}
        />
      </View>

      <Pressable
        onPress={openCustomModal}
        style={styles.button}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Text>Open sheet modal</Text>
      </Pressable>
      <SheetModal
        ref={customSheetModalRef}
        snapPoints={snapPoints}
        autoResize={autoResize}
        closeY={closeY}
        detached={detached}
        minHeight={minHeight}
        offset={offset}
        panContent={panContent}
        panDownToClose={panDownToClose}
        snapPointIndex={-1}
        position={position}
        withBackdrop={withBackDrop}
        withClosebutton={withCloseButton}
      >
        <SheetModalDynamicContent />
      </SheetModal>
    </>
  );
}
