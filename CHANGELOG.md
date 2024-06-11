# Changelog

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