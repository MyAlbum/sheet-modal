import { Slot } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

// Prevent awful Expo default layout creating bar at the top and bottom
function Layout() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    ScreenOrientation.unlockAsync();
  }, []);

  return <Slot />;
}

export default Layout;
