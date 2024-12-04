// components/ImageUploader.tsx
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface ImageUploaderProps {
  currentImage?: string;
  onImageSelect: (file: File) => Promise<void>;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onImageSelect }) => {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      // Convert uri to File object
      const response = await fetch(uri);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: "image/jpeg" });
      await onImageSelect(file);
    }
  };

  return (
    <View style={styles.container}>
      {currentImage && (
        <Image source={{ uri: currentImage }} style={styles.image} />
      )}
      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text>Change Image</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});