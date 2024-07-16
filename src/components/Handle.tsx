import React from 'react';
import { View } from 'react-native';
import useSharedState from '../hooks/useSharedState';
import useSheetModal from '../hooks/useSheetModal';

function SheetHandle() {
  const store = useSheetModal();
  const config = useSharedState(store.config);

  return <View style={config.handleStyle} />;
}
export default SheetHandle;
