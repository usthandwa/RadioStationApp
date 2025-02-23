/* import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image, Animated, Easing, Modal, Platform, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from '@expo/vector-icons/FontAwesome';
import { cacheData, fetchLiveStreamInfo, getCachedData } from '@/src/services/cmsApi';

const { width } = Dimensions.get('window');

interface Show {
  name: string;
  time: string;
  presenter: string;
  synopsis: string;
}

interface Presenter {
  name: string;
  bio: string;
  image: string; // URL to image in CMS
}

const LiveStreamScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [presenters, setPresenters] = useState<{ [key: string]: Presenter }>({});
  const [shows, setShows] = useState<{
    weekday: Show[];
    friday: Show[];
    weekend: Show[];
  }>({
    weekday: [],
    friday: [],
    weekend: []
  });
  
  const [currentShow, setCurrentShow] = useState<Show | null>(null);
  const [currentPresenter, setCurrentPresenter] = useState<Presenter | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [selectedPresenter, setSelectedPresenter] = useState<Presenter | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [upcomingShows, setUpcomingShows] = useState<Show[]>([]);

  // Load data from CMS
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Try to get cached data first
        const cachedData = await getCachedData('livestreamData');
        if (cachedData) {
          setPresenters(cachedData.presenters);
          setShows(cachedData.shows);
          setIsLoading(false);
        }

        // Fetch fresh data from CMS
        const response = await fetchLiveStreamInfo();
        
        if (response) {
          // Process and organize the data
          const processedData = {
            presenters: response.presenters,
            shows: response.shows
          };

          // Update state
          setPresenters(processedData.presenters);
          setShows(processedData.shows);

          // Cache the new data
          await cacheData('livestreamData', processedData);
        }
      } catch (error) {
        console.error('Error loading livestream data:', error);
        // If we have cached data, we can continue with that
        if (!Object.keys(presenters).length) {
          setIsLoading(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Determine current show
  useEffect(() => {
    const determineCurrentShow = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      let currentShows: Show[];

      if (day === 5) { // Friday
        currentShows = shows.friday;
      } else if (day >= 1 && day <= 4) { // Monday to Thursday
        currentShows = shows.weekday;
      } else { // Weekend
        currentShows = shows.weekend;
      }

      let currentShowIndex = -1;
      for (let i = 0; i < currentShows.length; i++) {
        const show = currentShows[i];
        const [start, end] = show.time.split(' - ').map(time => parseInt(time.split(':')[0]));
        if (hour >= start && hour < end) {
          setCurrentShow(show);
          setCurrentPresenter(presenters[show.presenter]);
          setIsPlaying(true);
          currentShowIndex = i;
          break;
        }
      }

      if (currentShowIndex === -1) {
        setCurrentShow(null);
        setCurrentPresenter(null);
        setIsPlaying(false);
      } else {
        setUpcomingShows(currentShows.slice(currentShowIndex + 1));
      }
    };

    if (!isLoading && Object.keys(presenters).length > 0) {
      determineCurrentShow();
      const interval = setInterval(determineCurrentShow, 60000);
      return () => clearInterval(interval);
    }
  }, [isLoading, presenters, shows]);

  // Vinyl Record Effect Component
  const VinylRecordEffect = ({ isPlaying, children }: { isPlaying: boolean, children: React.ReactNode }) => {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      if (isPlaying) {
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start();

        Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.02,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      } else {
        rotateAnim.setValue(0);
        scaleAnim.setValue(1);
      }
    }, [isPlaying]);

    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={styles.vinylWrapper}>
        <Animated.View
          style={[
            styles.vinylContainer,
            {
              transform: [
                { rotate: spin },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <View style={styles.vinylLabel}>
            {children}
          </View>
        </Animated.View>
      </View>
    );
  };

  // Schedule rendering
  const renderSchedule = (scheduleType: 'weekday' | 'friday' | 'weekend') => (
    <View style={styles.scheduleContainer}>
      <Text style={styles.scheduleTitle}>
        {scheduleType === 'weekday' ? 'Monday to Thursday' :
         scheduleType === 'friday' ? 'Friday' : 'Weekend'} Schedule
      </Text>
      {shows[scheduleType].map((show, index) => (
        <TouchableOpacity
          key={index}
          style={styles.showItem}
          onPress={() => {
            setSelectedShow(show);
            setSelectedPresenter(presenters[show.presenter]);
            setModalVisible(true);
          }}
        >
          <Text style={styles.showName}>{show.name}</Text>
          <Text style={styles.showTime}>{show.time}</Text>
          <Text style={styles.showPresenter}>{show.presenter}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Live Stream</Text>
      
      {currentShow && currentPresenter ? (
        <View style={styles.currentShowContainer}>
          <Text style={styles.currentShow}>Now Playing: {currentShow.name}</Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedShow(currentShow);
              setSelectedPresenter(currentPresenter);
              setModalVisible(true);
            }}
          >
            <VinylRecordEffect isPlaying={isPlaying}>
              <Image 
                source={{ uri: currentPresenter.image }}
                style={styles.presenterImage}
              />
            </VinylRecordEffect>
          </TouchableOpacity>
          <Text style={styles.presenterName}>{currentPresenter.name}</Text>
        </View>
      ) : (
        <Text style={styles.currentShow}>Best of AWRSIDmedia</Text>
      )}

      {/* Stream player *//*}
      <View style={styles.iframeContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            src="https://iframe.iono.fm/s/187?background=c0cacb&accent=07477B"
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="autoplay"
          />
        ) : (
          <WebView
            source={{ uri: "https://iframe.iono.fm/s/187?background=c0cacb&accent=07477B" }}
            style={styles.webview}
            scrollEnabled={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        )}
      </View>

      {/* Social media buttons *//*}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('https://www.youtube.com/@thesidmedia4110/live')}
        >
          <Icon name="youtube-play" size={24} color="#fff" />
          <Text style={styles.buttonText}>Watch on YouTube</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('https://www.facebook.com/sidmedia/live')}
        >
          <Icon name="facebook" size={24} color="#fff" />
          <Text style={styles.buttonText}>Watch on Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* Schedule *//*}
      <View style={styles.scheduleWrapper}>
        {renderSchedule('weekday')}
        {renderSchedule('friday')}
        {renderSchedule('weekend')}
      </View>

      {/* Show/Presenter Modal *//*}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {selectedShow && selectedPresenter && (
                <>
                  <Text style={styles.modalTitle}>{selectedShow.name}</Text>
                  <Text style={styles.modalTime}>{selectedShow.time}</Text>
                  <Text style={styles.modalPresenter}>{selectedPresenter.name}</Text>
                  
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Show Synopsis</Text>
                    <Text style={styles.modalText}>{selectedShow.synopsis}</Text>
                  </View>
                  
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Presenter Bio</Text>
                    <Image 
                      source={{ uri: selectedPresenter.image }}
                      style={styles.presenterImageModal}
                    />
                    <Text style={styles.modalText}>{selectedPresenter.bio}</Text>
                  </View>
                </>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#c0cacb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#07477B',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#07477B',
  },
  currentShowContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentShow: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#07477B',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#07477B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  scheduleWrapper: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
  },
  scheduleContainer: {
    flex: 1,
    marginBottom: 20,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#07477B',
  },
  showItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  showName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#07477B',
  },
  showTime: {
    fontSize: 14,
    color: '#666',
  },
  showPresenter: {
    fontSize: 14,
    color: '#07477B',
  },
  iframeContainer: {
    width: '100%',
    height: 100,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  vinylWrapper: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  pulseCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  vinylContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  vinylGrooves: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  vinylLabel: {
    width: '40%',
    height: '40%',
    borderRadius: 50,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  presenterImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  presenterName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#07477B',
    marginBottom: 5,
  },
  ctaButton: {
    backgroundColor: '#07477B',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  
  upNextContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#c0cacb',
    borderRadius: 5,
  },
  upNextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#07477B',
  },
  upNextItem: {
    marginBottom: 10,
  },
  upNextName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#07477B',
  },
  upNextTime: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '90%',
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#07477B',
    marginBottom: 10,
  },
  modalTime: {
    fontSize: 18,
    color: '#555',
    marginBottom: 5,
  },
  modalPresenter: {
    fontSize: 20,
    fontWeight: '600',
    color: '#07477B',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07477B',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
  },
  presenterImageModal: {
    width: '90%',
    height: 200,
    // borderRadius: 75,
    alignSelf: 'center',
    marginTop: 15,
  },
  closeButton: {
    backgroundColor: '#07477B',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LiveStreamScreen; */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Modal,
  Platform,
  Linking,
  ActivityIndicator
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from '@expo/vector-icons/FontAwesome';
import { fetchLiveStreamInfo, getCachedData, cacheData } from '@/src/services/cmsApi';

// Platform-specific WebView component
const StreamPlayer = () => {
  if (Platform.OS === 'web') {
    return (
      <iframe
        src="https://iframe.iono.fm/s/187?background=c0cacb&accent=07477B"
        style={{ width: '100%', height: '100%', border: 'none' }}
        allow="autoplay"
      />
    );
  }

  // Android and iOS WebView
  return (
    <WebView
      source={{ uri: "https://iframe.iono.fm/s/187?background=c0cacb&accent=07477B" }}
      style={styles.webview}
      scrollEnabled={false}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowsInlineMediaPlayback={true}
      mediaPlaybackRequiresUserAction={false}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
      }}
      onHttpError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView HTTP error: ', nativeEvent);
      }}
    />
  );
};


interface Show {
  name: string;
  time: string;
  presenter: string;
  synopsis: string;
}

interface Presenter {
  name: string;
  bio: string;
  image: string;
}

const LiveStreamScreen: React.FC = () => {
  // State declarations
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const [presenters, setPresenters] = useState<Record<string, Presenter>>({});
  const [shows, setShows] = useState<{ weekday: Show[]; friday: Show[]; weekend: Show[] }>({ weekday: [], friday: [], weekend: [] });
  const [currentShow, setCurrentShow] = useState<Show | null>(null);
  const [currentPresenter, setCurrentPresenter] = useState<Presenter | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [selectedPresenter, setSelectedPresenter] = useState<Presenter | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [upcomingShows, setUpcomingShows] = useState<Show[]>([]);

  // Load data from CMS
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to get cached data first
      const cachedData = await getCachedData();
      if (cachedData) {
        setPresenters(cachedData.presenters);
        setShows(cachedData.shows);
      }

      // Fetch fresh data
      const response = await fetchLiveStreamInfo();
      if (response) {
        setPresenters(response.presenters);
        setShows(response.shows);
        await cacheData(response);
      }
    } catch (err) {
      console.error('Error loading livestream data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Retry logic
  const handleRetry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      loadData();
    } else {
      setError('Maximum retry attempts reached. Please try again later.');
    }
  }, [retryCount, loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Determine current show
  useEffect(() => {
    const determineCurrentShow = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      let currentShows: Show[];

      if (day === 5) { // Friday
        currentShows = shows.friday;
      } else if (day >= 1 && day <= 4) { // Monday to Thursday
        currentShows = shows.weekday;
      } else { // Weekend
        currentShows = shows.weekend;
      }

      let currentShowIndex = -1;
      for (let i = 0; i < currentShows.length; i++) {
        const show = currentShows[i];
        const [start, end] = show.time.split(' - ').map(time => parseInt(time.split(':')[0]));
        if (hour >= start && hour < end) {
          setCurrentShow(show);
          setCurrentPresenter(presenters[show.presenter]);
          setIsPlaying(true);
          currentShowIndex = i;
          break;
        }
      }

      if (currentShowIndex === -1) {
        setCurrentShow(null);
        setCurrentPresenter(null);
        setIsPlaying(false);
      } else {
        setUpcomingShows(currentShows.slice(currentShowIndex + 1));
      }
    };

    if (!isLoading && Object.keys(presenters).length > 0) {
      determineCurrentShow();
      const interval = setInterval(determineCurrentShow, 60000);
      return () => clearInterval(interval);
    }
  }, [isLoading, presenters, shows]);

  // Vinyl Record Effect Component
  const VinylRecordEffect = ({ isPlaying, children }: { isPlaying: boolean, children: React.ReactNode }) => {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      if (isPlaying) {
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start();

        Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.02, duration: 1000, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          ])
        ).start();
      } else {
        rotateAnim.setValue(0);
        scaleAnim.setValue(1);
      }
    }, [isPlaying, rotateAnim, scaleAnim]);

    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={styles.vinylWrapper}>
        <Animated.View
          style={[
            styles.vinylContainer,
            {
              transform: [
                { rotate: spin },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <View style={styles.vinylLabel}>
            {children}
          </View>
        </Animated.View>
      </View>
    );
  };

  // Schedule rendering
  const renderSchedule = useCallback((scheduleType: 'weekday' | 'friday' | 'weekend') => (
    <View style={styles.scheduleContainer}>
      <Text style={styles.scheduleTitle}>
        {scheduleType === 'weekday' ? 'Monday to Thursday' : scheduleType === 'friday' ? 'Friday' : 'Weekend'} Schedule
      </Text>
      {shows[scheduleType].map((show, index) => (
        <TouchableOpacity
          key={index}
          style={styles.showItem}
          onPress={() => {
            setSelectedShow(show);
            setSelectedPresenter(presenters[show.presenter]);
            setModalVisible(true);
          }}
        >
          <Text style={styles.showName}>{show.name}</Text>
          <Text style={styles.showTime}>{show.time}</Text>
          <Text style={styles.showPresenter}>{show.presenter}</Text>
        </TouchableOpacity>
      ))}
    </View>
  ), [presenters, shows]);

  if (error) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        {retryCount < maxRetries && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#07477B" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Live Stream</Text>

      {currentShow && currentPresenter ? (
        <View style={styles.currentShowContainer}>
          <Text style={styles.currentShow}>Now Playing: {currentShow.name}</Text>
          <TouchableOpacity onPress={() => {
            setSelectedShow(currentShow);
            setSelectedPresenter(currentPresenter);
            setModalVisible(true);
          }}>
            <VinylRecordEffect isPlaying={isPlaying}>
              <Image
                source={{ uri: currentPresenter.image }}
                style={styles.presenterImage}
              />
            </VinylRecordEffect>
          </TouchableOpacity>
          <Text style={styles.presenterName}>{currentPresenter.name}</Text>
        </View>
      ) : (
        <Text style={styles.currentShow}>Best of AWRSIDmedia</Text>
      )}

      {/* Stream player */}
      <View style={styles.iframeContainer}>
        {Platform.OS === 'web' ? (
          <iframe src="https://iframe.iono.fm/s/187?background=c0cacb&accent=07477B" style={{ width: '100%', height: '100%', border: 'none' }} allow="autoplay" />
        ) : (
          <WebView source={{ uri: "https://iframe.iono.fm/s/187?background=c0cacb&accent=07477B" }} style={styles.webview} scrollEnabled={false} javaScriptEnabled={true} domStorageEnabled={true} />
        )}
      </View>

      {/* Social media buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://www.youtube.com/@thesidmedia4110/live')}>
          <Icon name="youtube-play" size={24} color="#fff" />
          <Text style={styles.buttonText}>Watch on YouTube</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://www.facebook.com/sidmedia/live')}>
          <Icon name="facebook" size={24} color="#fff" />
          <Text style={styles.buttonText}>Watch on Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* Schedule */}
      <View style={styles.scheduleWrapper}>
        {renderSchedule('weekday')}
        {renderSchedule('friday')}
        {renderSchedule('weekend')}
      </View>

      {/* Show/Presenter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {selectedShow && selectedPresenter && (
                <>
                  <Text style={styles.modalTitle}>{selectedShow.name}</Text>
                  <Text style={styles.modalTime}>{selectedShow.time}</Text>
                  <Text style={styles.modalPresenter}>{selectedPresenter.name}</Text>

                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Show Synopsis</Text>
                    <Text style={styles.modalText}>{selectedShow.synopsis}</Text>
                  </View>

                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Presenter Bio</Text>
                    <Image
                      source={{ uri: selectedPresenter.image }}
                      style={styles.presenterImageModal}
                    />
                    <Text style={styles.modalText}>{selectedPresenter.bio}</Text>
                  </View>
                </>
              )}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#c0cacb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#07477B',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#07477B',
  },
  currentShowContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentShow: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#07477B',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#07477B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  scheduleWrapper: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
  },
  scheduleContainer: {
    flex: 1,
    marginBottom: 20,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#07477B',
  },
  showItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  showName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#07477B',
  },
  showTime: {
    fontSize: 14,
    color: '#666',
  },
  showPresenter: {
    fontSize: 14,
    color: '#07477B',
  },
  iframeContainer: {
    width: '100%',
    height: 100,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  vinylWrapper: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  pulseCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  vinylContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  vinylGrooves: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  vinylLabel: {
    width: '40%',
    height: '40%',
    borderRadius: 50,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  presenterImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  presenterName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#07477B',
    marginBottom: 5,
  },
  ctaButton: {
    backgroundColor: '#07477B',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  upNextContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#c0cacb',
    borderRadius: 5,
  },
  upNextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#07477B',
  },
  upNextItem: {
    marginBottom: 10,
  },
  upNextName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#07477B',
  },
  upNextTime: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '90%',
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#07477B',
    marginBottom: 10,
  },
  modalTime: {
    fontSize: 18,
    color: '#555',
    marginBottom: 5,
  },
  modalPresenter: {
    fontSize: 20,
    fontWeight: '600',
    color: '#07477B',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07477B',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
  },
  presenterImageModal: {
    width: '90%',
    height: 200,
    alignSelf: 'center',
    marginTop: 15,
  },
  closeButton: {
    backgroundColor: '#07477B',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  loadingText: {
    marginTop: 10,
    color: '#07477B',
    fontSize: 16,
  }
});

export default LiveStreamScreen;


