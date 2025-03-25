# Changelog

## [v3.1.3](https://github.com/MyAlbum/sheet-modal/releases/tag/v3.1.3)
### Added
Added an optional callback to the `close` method to be called after the modal has been closed.

## [v3.1.2](https://github.com/MyAlbum/sheet-modal/releases/tag/v3.1.2)
### Summary
Fixed a react-native-gesture-handler warning about callbacks not being marked as worklets.

## [v3.1.1](https://github.com/MyAlbum/sheet-modal/releases/tag/v3.1.1)
### Summary
Renamed `window` variables to `windowDimensions` to prevent conflicts with the global `window` object.
### Changes
- Refactored `window` variables to `windowDimensions`

## [v3.1.0](https://github.com/MyAlbum/sheet-modal/releases/tag/v3.1.0)
### Summary
Added `autoShrink` prop to the modal. This prop makes the modal shrink to the content height when the content is smaller than the modal. Default is `true`.
### Added
- `autoShrink` prop

## [v3.0.0](https://github.com/MyAlbum/sheet-modal/releases/tag/v3.0.0)
### Summary
Renamed `onContentLayout` to `setContentLayout`. This method is useful when you want to update the content layout after the modal has been mounted.
### Changed
- `onContentLayout` method renamed to `setContentLayout`
### Removed
- `autoResize` prop because `setContentLayout` is more flexible

## [v2.6.1](https://github.com/MyAlbum/sheet-modal/releases/tag/v2.6.1)
### Fixed
- Modal width not resizing when using `autoResize`
- snapPoint larger than maxHeight or "100%" not working

## [v2.6.0](https://github.com/MyAlbum/sheet-modal/releases/tag/v2.6.0)
### Summary
Added a prop to render the modal in a different portal
### Added
- `portalHostName` prop to render in a different portal
### Fixed
- Crash on native when triggering `onSnapPointChanged`

## [v2.5.0](https://github.com/MyAlbum/sheet-modal/releases/tag/v2.5.0)
### Summary
Added `portal` export
### Added
- `portal` exported

## [v2.4.0](https://github.com/MyAlbum/sheet-modal/releases/tag/v2.4.0)
### Summary
Added `onSnapPointChanged` prop that is triggered when the snap point has been changed.
### Added
- `onSnapPointChanged` prop


## [v2.3.0](https://github.com/MyAlbum/sheet-modal/releases/tag/v2.3.0)
### Summary
We made some internal changes for readability and maintainability. We also fixed a bug where the modal would not react to prop changes
### Fixed
- Reactivity of props
### Changes
- Linting rules, code style, and auto formatting enhancements

## [v2.2.1](https://github.com/MyAlbum/sheet-modal/releases/tag/v2.2.1)
### Summary
SheetModalProvider props should be optional, this regression was fixed in this release.
### Fixed
- SheetModalProvider props are optional

## [v2.2.0](https://github.com/MyAlbum/sheet-modal/releases/tag/v2.2.0)
### Summary
Examples were updated to the latest release of `react-native` and `expo`. Performance fixes.

### Changed
- Fixed Reanimated warnings
- config is now a SharedValue
- Improved pan detection when at the top of the modal
- Fixed clicks not recognised at the top of the modal
- Focustrap isn't cancelled anymore on `escape`

### Added
- Prevent text selection when panning on Web

## [v2.1.0](https://github.com/MyAlbum/sheet-modal/releases/tag/v2.1.0)
### Summary
Allow for more complext layout designs. By default modals are not scrollable, you need to implement this yourself with the new `SheetModal.ScrollView` component.
### Added
- Export new `ScrollView` component
### Changed
- Ignore contentLayout when converting snapPoints and autoResize is disabled
### Fixed
- Unmount after dismissing modal through pan gesture

## [v2.0.0](https://github.com/MyAlbum/sheet-modal/releases/tag/v2.0.0)
### Summary
Upon careful consideration we have determined that integrating `closeOnEscape` feature is too dependent on the user's specific implementation.

### Removed
- Removed `closeOnEscape`

## [v1.4.1](https://github.com/MyAlbum/sheet-modal/releases/tag/v1.4.1)
### Changed
- Updated `react-native` in bare example
- Updated `expo` in expo example
- Moved `focus-trap-react` to `devDependencies` and `peerDependencies
- Focus trap does not initially focus the first focusable element anymore

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