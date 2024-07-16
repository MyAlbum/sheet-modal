import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export default function useBackHandler(cb: () => boolean) {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return cb();
    });

    return () => backHandler.remove();
  }, [cb]);
}
