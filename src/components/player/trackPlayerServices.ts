import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';

let sound: Audio.Sound | null = null;
let isPlayerReady = false;

export const setupPlayer = async () => {
  if (isPlayerReady) return;
  try {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });
    isPlayerReady = true;
  } catch (error) {
    console.error('Error setting up player:', error);
  }
};

export const loadAndPlayTrack = async () => {
  if (!isPlayerReady) await setupPlayer();
  try {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: 'https://edge.iono.fm/xice/187_medium.aac' },
      { shouldPlay: true }
    );
    sound = newSound;
    await sound.playAsync();
    return true; // Indicate successful loading and playing
  } catch (error) {
    console.error('Error loading and playing track:', error);
    return false; // Indicate failure
  }
};

export const pauseTrack = async () => {
  try {
    if (sound) {
      await sound.pauseAsync();
    }
  } catch (error) {
    console.error('Error pausing track:', error);
  }
};

export const resumeTrack = async () => {
  try {
    if (sound) {
      await sound.playAsync();
    }
  } catch (error) {
    console.error('Error resuming track:', error);
  }
};

export const togglePlayback = async () => {
  if (!isPlayerReady) await setupPlayer();
  if (!sound) {
    return await loadAndPlayTrack();
  } else {
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      if (status.isPlaying) {
        await pauseTrack();
      } else {
        await resumeTrack();
      }
      return true; // Indicate successful toggle
    } else {
      return await loadAndPlayTrack();
    }
  }
};

export const usePlaybackState = () => {
  const [playbackState, setPlaybackState] = useState('paused');

  useEffect(() => {
    const checkPlaybackStatus = async () => {
      if (sound) {
        const status = await sound.getStatusAsync();
        setPlaybackState(status.isLoaded ? (status.isPlaying ? 'playing' : 'paused') : 'loading');
      } else {
        setPlaybackState('paused');
      }
    };

    const interval = setInterval(checkPlaybackStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return playbackState;
};