# Changelog

## [v1.4.0](https://github.com/MyAlbum/sheet-modal/releases/tag/v1.4.0)
#### Added
- `autoFocus` method in `SheetModalMethods` to focus a node in the sheet modal

## [v1.3.0](https://github.com/MyAlbum/sheet-modal/releases/tag/v1.3.0)
#### Added
- onClosed prop (triggered after close animation is finished)
- onOpened prop (triggered after opening animation is finished)

#### Fixed
- fixed an issue causing issues detecting top-most modal
- closeButton focusRing fix (web)
- always keep visibilityPercentage between 0 and 1

## [v1.2.0](https://github.com/MyAlbum/sheet-modal/releases/tag/v1.2.0)
#### Added
- Support for withFocusTrap (web) using focus-trap-react

## [v1.1.3](https://github.com/MyAlbum/sheet-modal/releases/tag/v1.1.3)
#### Fixed
- Fixed height calculations when using borders in containerStyle

## [v1.1.2](https://github.com/MyAlbum/sheet-modal/releases/tag/v1.1.2)
#### Fixed
- Fixed Portal bug

## [v1.1.1](https://github.com/MyAlbum/sheet-modal/releases/tag/v1.1.1)

#### Added
- Added missing `Advanced` documentation

#### Removed
- Removed Gorhom Portal dependencies in examples

## [v1.1.0](https://github.com/MyAlbum/sheet-modal/releases/tag/v1.1.0)

#### Changes
- Default export to named export `SheetModal`
- Default snapPoints to `["100%"]`
- Escape key moved from `onKeyDown` to `onKeyUp` (prevents React Native Web issues)
- Replaced Gorhom Portal with custom component
- Improved closebutton styling

#### Added
- `animateOnMount` prop
- Stacking support for multiple `SheetModal` components (latest opened on top, escape key handled by top `sheetmodal`)

## [v1.0.0](https://github.com/MyAlbum/sheet-modal/releases/tag/v1.0.0)

Initial version