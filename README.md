# SheetModal
An interactive sheet modal, fully customizable, performance focused

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/myalbum/sheet-modal/publish.yml)
![GitHub License](https://img.shields.io/github/license/myalbum/sheet-modal)
![GitHub Release](https://img.shields.io/github/v/release/myalbum/sheet-modal)
[![Runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-000020.svg?style=flat&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.io/)
[![Runs with react-native](https://img.shields.io/badge/Runs%20with%20react--native-000000.svg?style=flat&logo=react)](https://reactnative.dev)


- Supports modal and detached view
- Smooth animations and snapping
- Configurable snap points
- Nested `SheetModalProviders` that automatically inherit props
- Runs on [Expo](https://expo.dev) & [React Native](https://reactnative.dev)
- Compatible with iOS, Android & web
- Written in TypeScript

<br/><br/>

## Index
- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [Methods](#methods)
- [Examples](#examples)
- [License](#license)
- [Contributing](#contributing)


<br/><br/>

## Installation
### Install with yarn 
```
$ yarn add @myalbum/sheet-modal
```

### Install with Expo
```
$ expo install @myalbum/sheet-modal
```
<br/>

### Dependencies
This library depends on [React Native Reanimated](https://github.com/software-mansion/react-native-reanimated) & [React Native Gesture Handler](https://github.com/software-mansion/react-native-gesture-handler)

#### Install with yarn
```
$ yarn add react-native-reanimated react-native-gesture-handler
```

#### Install with expo
```
$ npx expo install react-native-reanimated react-native-gesture-handler
```

<br/>

> [!IMPORTANT]
> **React Native Gesture Handler** needs extra installation steps, please follow their [guide](https://docs.swmansion.com/react-native-gesture-handler/docs/installation)
>
> **React Native Reanimated** needs extra installation steps, please follow their [guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)

<br/><br/><br/>

## Usage

Below a simple usage example

```tsx
import React, { useCallback, useRef } from 'react';
import { SheetModal, SheetModalMethods } from '@myalbum/sheet-modal';

export default function App() {
  const sheetModalRef = useRef<SheetModalMethods>(null);

  const openSheetModal = useCallback(() => {
    sheetModalRef.current?.snapToIndex(0);
  }, []);

  return (
    <View>
      <Button
        title="Open sheet modal"
        onPress={openSheetModal}
      />
      <SheetModal
        ref={sheetModalRef}
        snapPoints={[0, 200, 400]}
      >
        <View style={styles.container}>
          <Text>Sheet modal content</Text>
        </View>
      </SheetModal>
    </View>
  );
}
```

- [Responsive](docs/Responsive.md)
<br/>Auto switch between detached/attached based on screensize
- [Advanced usage](docs/Advanced.md)
<br/>useSheetModal hook and get access to internal methods/state

<br/><br/><br/>

## Props

The props below can be used in any `SheetModalProvider` or `SheetModal`. The props will inherit from nested `SheetModalProvider` to `SheetModal`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `closeOnEscape` | `boolean` | `true` | Close the sheet modal when pressing the escape key on the web |
| `withClosebutton` | `boolean` | `true` | Render a close button in the header |
| `withFocusTrap` | `boolean` | `true` | Trap focus inside Modal (web)
| `withBackdrop` | `boolean` | `true` | Render a backdrop behind the sheet modal |
| `snapPoints` | `Array<number \| string>` | `["100%"]` | Array of snappoints for the sheet modal, in pixels (number) or percentage (string).<br/><br/>If a snapPoint is greater than the content height, the sheet modal will not expand beyond the actual content size. |
| `snapPointIndex` | `number` | `-1` | Initial snap index. Provide -1 to initiate sheet in closed state |
| `panDownToClose` | `boolean` | `true` | Allow panning down to close the sheet modal |
| `panContent` | `boolean` | `true` | Allow panning the content of the sheet modal, when false and panDownToClose is true, only the handle can be used to pan |
| `minHeight` | `number` | `50` | Minimum height of the sheet modal |
| `closeY` | `number` | `-50` | Y position of the sheet modal when closed, should be something (0 - shadow size) |
| `autoResize` | `boolean` | `true` | Automaticaly resize the sheet modal to the nearest snapp point when content is smaller than the current snap point |
| `detached` | `boolean` | `false` | Detach the sheet modal from the bottom of the screen |
| `position` | `["bottom" \| "center" \| "top", "left" \| "center" \| "right"]` | `["center", "center"]` | Position of the sheet modal, [vertical, horizontal] <br/><br/> *Attached mode ignores vertical position* |
| `offset` | `[number, number]` | `[50, 30]` | Offset from the screen, [vertical, horizontal] |



<br/><br/>

### Props for custom styling

| Prop | Description |
| --- | --- |
| `containerStyle` | Styling for the modal container ||
| `headerStyle` | Styling for the header ||
| `handleStyle` | Styling for the handle ||
| `closeButtonStyle` | <pre>{<br>  iconColor: string<br>  backgroundColor: string<br>}</pre> Both are optional and will inherit from nested `SheetModalProvider`|

<br/><br/>

### Props for custom components

| Prop | Type | Description |
| --- | --- | --- |
| `backdropComponent` | `() => ReactNode` | Custom backdrop component |
| `closeButtonComponent` | `() => ReactNode` | Custom close button component |
| `handleComponent` | `() => ReactNode` | Custom handle component |

<br/><br/><br/>

## Methods

The methods below can be used in the `SheetModal` component

| Method | Description |
| --- | --- |
| `snapToIndex: (index: number, animate?: boolean) => void` | Snap to a specific snap point |
| `dismiss: () => void` | Dismiss the sheet modal |

<br/><br/><br/>

## Examples

See the [examples](examples) directory for a full example of how to use the library.

### Running the examples

First bootstrap the examples by installing the dependencies

```bash
$ yarn bootstrap
```

> [!IMPORTANT]
> For the bare example you need prepare the Pod project before running the example, this can be done by running: `$ cd examples/bare && yarn prepare-ios`

After that you can run the examples:
- `$ yarn expo` to start the expo example
- `$ yarn bare` to start the bare react-native example

<br/><br/><br/>

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information on how to contribute to this project.

## Build with ❤️

- [React Native Reanimated](https://github.com/software-mansion/react-native-reanimated)
- [React Native Gesture Handler](https://github.com/software-mansion/react-native-gesture-handler)
- [focus-trap-react](https://github.com/focus-trap/focus-trap-react)
