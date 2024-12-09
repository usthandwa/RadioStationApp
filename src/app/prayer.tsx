import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import PrayerScreen from '@/screens/main/prayer/PrayerScreen';


export default function PrayerRoute() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerTitle: "Prayer" }} />
      <PrayerScreen />
    </View>
  );
}
