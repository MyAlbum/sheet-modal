import React from "react";
import { View } from "react-native";
import useSheetModal from "../hooks/useSheetModal";
import useSharedState from "../hooks/useSharedState";

function SheetHandle() {
  const store = useSheetModal();
  const config = useSharedState(store.config);

  return <View style={config.handleStyle} />;
}
export default SheetHandle;
