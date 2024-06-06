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
| `present: () => void` | Present the sheet modal |
| `dismiss: () => void` | Dismiss the sheet modal |
| `snapTo: (index: number) => void` | Snap to a specific snap point |
| `state` | `Object` | The current state of the sheet modal, see [SheetModalState](#SheetModalState) |
