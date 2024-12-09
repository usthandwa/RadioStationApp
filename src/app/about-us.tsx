import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import AboutUsScreen from '@/screens/main/About/AboutUsScreen';


export default function AboutUsRoute() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerTitle: "About Us" }} />
      <AboutUsScreen />
    </View>
  );
}
