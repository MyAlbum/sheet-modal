# Advanced usage

## With `useSheetModal` hook

The `useSheetModal` hook is a custom hook that provides the `SheetModalMethods` instance of the nearest `SheetModal` component in the component tree.

```tsx
import { SheetModal, useSheetModal, SheetModalMethods } from '@myalbum/sheet-modal';

export default function App() {
  const sheetModalRef = useRef<SheetModalMethods>();

  const presentSheetModal = useCallback(() => {
    sheetModalRef.present();
  }, [sheetModal]);

  return (
    <View>
      <Button
        title="Open sheet modal"
        onPress={presentSheetModal}
      />
      <SheetModal
        ref={sheetModalRef}
        snapPoints={[0, 200, 400]}
      >
        <ModalContent />
      </SheetModal>
    </View>
  );
}

function ModalContent() {
  const sheetModal = useSheetModal();

  return (
    <View>
      <Button
        title="Close sheet modal"
        onPress={sheetModal.dismiss}
      />
    </View>
  );
}
```

The `useSheetModal` hook returns an object with the following properties:

| Property | Type | Description |
| --- | --- | --- |
| `id` | `string` | Dutogenerated id |
| `config` | `Object` | The current config, see [SheetModalConfig](#SheetModalConfig) |
| `close` | `() => void` | Dismiss the sheet modal |
| `snapTo` | `(index: number) => void` | Snap to a specific snap point |
| `state` | `Object` | The current state of the sheet modal, see [SheetModalState](#SheetModalState) |
| `onContentLayout` | `(w: number, h: number) => void` | Triggered when the size of the content changes |
| `getNextSnapPointIndex` | `(snapPoints: number[], y: number) => number` | Get the next snapPointIndex based on the y position |
| `getPreviousSnapPointIndex` | `(snapPoints: number[], y: number) => number` | Get the previous snapPointIndex based on the y position |
| `getYForHeight` | `(h: number) => number` | Calculate the y position from the given height |

### SheetModalConfig

The `SheetModalConfig` is a copy of all the props that can be passed to the `SheetModal` component. All props that are not passed to the `SheetModal` component will be set to the default value.

### SheetModalState

The `SheetModalState` object contains the following properties:

| Property | Type | Description |
| --- | --- | --- |
| `height` | `SharedValue<number>` | The current height of the sheet modal |
| `y` | `SharedValue<number>` | The current y offset of the sheet modal |
| `snapPoints` | `SharedValue<number[]>` | Calculated snapPoints based on the current viewport dimensions |
| `snapPointIndex` | `SharedValue<number>` | The current snap point index |
| `visibilityPercentage` | `SharedValue<number>` | Used for the backdrop |
| `contentLayout` | `SharedValue<{width: number, heihght: number}>` | The layout of the content |
| `isPanning` | `SharedValue<boolean>` | Indicates if the user is currently panning the sheet modal |
| `isClosed` | `SharedValue<boolean>` | Indicates if the sheet modal is currently closed |