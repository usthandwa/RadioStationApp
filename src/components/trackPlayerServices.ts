import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';

let sound: Audio.Sound | null = null;
let isPlayerReady = false;

export const setupPlayer = async (): Promise<void> => {
  if (isPlayerReady) return;
  try {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });
    isPlayerReady = true;
  } catch (error) {
    console.error('Error setting up player:', error);
    throw error;
  }
};

export const loadAndPlayTrack = async (): Promise<boolean> => {
  if (!isPlayerReady) await setupPlayer();
  try {
    // Unload existing sound if any
    if (sound) {
      await sound.unloadAsync();
      sound = null;
    }
    
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: 'https://edge.iono.fm/xice/187_medium.aac' },
      { shouldPlay: true },
      onPlaybackStatusUpdate
    );
    sound = newSound;
    await sound.playAsync();
    return true;
  } catch (error) {
    console.error('Error loading and playing track:', error);
    return false;
  }
};

const onPlaybackStatusUpdate = (status: any) => {
  if (status.error) {
    console.error('Playback error:', status.error);
  }
  if (status.didJustFinish) {
    console.log('Track finished playing');
  }
};

export const pauseTrack = async (): Promise<void> => {
  try {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        await sound.pauseAsync();
      }
    }
  } catch (error) {
    console.error('Error pausing track:', error);
    throw error;
  }
};

export const resumeTrack = async (): Promise<void> => {
  try {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await sound.playAsync();
      }
    }
  } catch (error) {
    console.error('Error resuming track:', error);
    throw error;
  }
};

export const togglePlayback = async (): Promise<boolean> => {
  if (!isPlayerReady) await setupPlayer();
  
  try {
    if (!sound) {
      return await loadAndPlayTrack();
    }
    
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      if (status.isPlaying) {
        await pauseTrack();
      } else {
        await resumeTrack();
      }
      return true;
    } else {
      return await loadAndPlayTrack();
    }
  } catch (error) {
    console.error('Error toggling playback:', error);
    return false;
  }
};

export const cleanupPlayer = async (): Promise<void> => {
  try {
    if (sound) {
      await sound.unloadAsync();
      sound = null;
    }
    isPlayerReady = false;
  } catch (error) {
    console.error('Error cleaning up player:', error);
  }
};

export const usePlaybackState = () => {
  const [playbackState, setPlaybackState] = useState<'paused' | 'playing' | 'loading'>('paused');

  useEffect(() => {
    const checkPlaybackStatus = async () => {
      try {
        if (sound) {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            setPlaybackState(status.isPlaying ? 'playing' : 'paused');
          } else {
            setPlaybackState('loading');
          }
        } else {
          setPlaybackState('paused');
        }
      } catch (error) {
        console.error('Error checking playback status:', error);
        setPlaybackState('paused');
      }
    };

    const interval = setInterval(checkPlaybackStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return playbackState;
};