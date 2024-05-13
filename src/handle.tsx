import React from "react";
import { View } from "react-native";
import useSheetModal from "./hooks/useSheetModal";

function SheetHandle() {
  const store = useSheetModal();

  return <View style={store.config.handleStyle} />;
}
export default SheetHandle;
