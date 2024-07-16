import { useContext } from 'react';
import SheetModalContext from '../context';

function useSheetModal() {
  return useContext(SheetModalContext);
}

export default useSheetModal;
