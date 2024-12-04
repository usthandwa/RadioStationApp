import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { EditableField } from '../components/ui/EditableField';
import { ImageUploader } from '../components/ui/ImageUploader';
import { fetchShows, updateShow, uploadPresenterImage } from '../services/api/cmsApi';
import { Show } from '../types/auth';

type RouteParams = {
  showId: number;
};

interface Props {
  route: RouteProp<{ params: RouteParams }, 'params'>;
}

export const ShowManagement: React.FC<Props> = ({ route }) => {
  const { showId } = route.params;
  const [show, setShow] = useState<Show | null>(null);
  
  useEffect(() => {
    const loadShow = async () => {
      const shows = await fetchShows();
      const foundShow = shows.find(s => s.id === showId);
      setShow(foundShow || null);
    };
    loadShow();
  }, [showId]);

  const handleUpdate = async (field: string, value: string) => {
    if (!show) return;
    try {
      const updated = await updateShow(showId, { [field]: value });
      setShow(updated);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (!show) return null;

  return (
    <ScrollView style={{ padding: 15 }}>
      <EditableField
        label="Show Name"
        value={show.title}
        onSave={(value) => handleUpdate('title', value)}
      />
      <EditableField
        label="Synopsis"
        value={show.synopsis}
        onSave={(value) => handleUpdate('synopsis', value)}
      />
      <ImageUploader
        currentImage={show.imageUrl}
        onImageSelect={async (file) => {
          if (!show.presenterId) return;
          const imageUrl = await uploadPresenterImage(show.presenterId, file);
          await handleUpdate('imageUrl', imageUrl);
        }}
      />
    </ScrollView>
  );
};