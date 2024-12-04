// src/components/navigation/TabBarIcon.tsx
import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TabBarIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number;
  focused?: boolean;
}

export default function TabBarIcon({ 
  name, 
  color, 
  size = 24,
  focused = false 
}: TabBarIconProps) {
  return (
    <View style={{ opacity: focused ? 1 : 0.5 }}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}