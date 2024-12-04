// components/EditableField.tsx
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => Promise<void>;
}

export const EditableField: React.FC<EditableFieldProps> = ({ label, value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [error, setError] = useState('');

  const handleSave = async () => {
    try {
      await onSave(currentValue);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Failed to save changes');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {isEditing ? (
        <View>
          <TextInput
            value={currentValue}
            onChangeText={setCurrentValue}
            style={styles.input}
            multiline={label === 'Bio' || label === 'Synopsis'}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleSave} style={styles.button}>
              <Text>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.button}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setIsEditing(true)}>
          <Text>{value}</Text>
        </TouchableOpacity>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

// components/ImageUploader.tsx
import { Image} from 'react-native';
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