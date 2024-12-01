import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  SafeAreaView, 
  Dimensions, 
  Platform, 
  StatusBar, 
  Alert, 
  Animated, 
  Easing 
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import SocialScreen from './SocialScreen';
import { setupPlayer, togglePlayback, usePlaybackState } from '../components/trackPlayerServices';
import Menu from '@/components/Menu';

const { width, height } = Dimensions.get('window');

interface CardData {
  id: string;
  title: string;
  description: string;
  imageSrc: any;
  contentType: string;
  isListenLive?: boolean;
}

export default function HomeScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isLoading, setIsLoading] = useState(false);
  const playbackState = usePlaybackState();
  const spinValue = useRef(new Animated.Value(0)).current;
  const spinAnimation = useRef<Animated.CompositeAnimation | null>(null);

  const [cards] = useState<CardData[]>([
    {
      id: '1',
      title: "Listen Live",
      description: "Tune into our live broadcast",
      imageSrc: require('../assets/Listen_Live.jpg'),
      contentType: 'live-stream',
      isListenLive: true
    },
    {
      id: '2',
      title: "Podcasts",
      description: "Catch up with the shows you missed and more...",
      imageSrc: require('../assets/podcasts.jpg'),
      contentType: 'podcasts'
    },
    {
      id: '3',
      title: "Give",
      description: "Support the ministry",
      imageSrc: require('../assets/Give.jpg'),
      contentType: 'give'
    },
    {
      id: '4',
      title: "Prayer",
      description: "Have someone pray with you",
      imageSrc: require('../assets/Prayer.jpg'),
      contentType: 'prayer'
    },
    {
      id: '5',
      title: "Socials",
      description: "",
      imageSrc: require('../assets/social.jpg'),
      contentType: 'social'
    }
  ]);

  const startSpinAnimation = useCallback(() => {
    if (spinAnimation.current) {
      spinAnimation.current.stop();
    }
    spinValue.setValue(0);
    spinAnimation.current = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinAnimation.current.start();
  }, [spinValue]);

  const stopSpinAnimation = useCallback(() => {
    if (spinAnimation.current) {
      spinAnimation.current.stop();
      spinAnimation.current = null;
    }
    spinValue.setValue(0);
  }, [spinValue]);

  useEffect(() => {
    if (isLoading) {
      startSpinAnimation();
    } else {
      stopSpinAnimation();
    }
  }, [isLoading, startSpinAnimation, stopSpinAnimation]);

  const handleTogglePlay = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await togglePlayback();
    } catch (error) {
      console.error('Error handling audio:', error);
      Alert.alert('Audio Error', 'Unable to play the audio. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleCardPress = useCallback((card: CardData) => {
    if (card.title === 'Socials') {
      return;
    }
    
    router.push({
      pathname: `/${card.contentType}`,
      params: { title: card.title }
    });
  }, [router]);

  const renderCard = useCallback((card: CardData) => {
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <TouchableOpacity 
        key={card.id}
        style={styles.card} 
        onPress={() => handleCardPress(card)}
      >
        <Image source={card.imageSrc} style={styles.cardImage} />
        <View style={styles.cardOverlay}>
          <Text style={styles.cardTitle}>{card.title}</Text>
          <Text style={styles.cardDescription}>{card.description}</Text>
          {card.isListenLive && (
            <TouchableOpacity 
              style={styles.playButton} 
              onPress={handleTogglePlay}
              disabled={isLoading}
            >
              {isLoading ? (
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Icon name="circle-o-notch" size={40} color="#07477B" />
                </Animated.View>
              ) : (
                <Icon 
                  name={playbackState === 'playing' ? 'pause' : 'play'} 
                  size={40} 
                  color="#07477B" 
                />
              )}
            </TouchableOpacity>
          )}
          {card.title === 'Socials' && (
            <View style={styles.socialContainer}>
              <SocialScreen />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [handleTogglePlay, playbackState, isLoading, spinValue, handleCardPress]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await setupPlayer();
      } catch (error) {
        console.error('Error setting up player:', error);
      }
    };
    initialize();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require('../assets/awr_sidmedia_logo.png')}
          style={styles.logo}
          accessibilityLabel="AWR SIDMedia Logo"
        />
        {/* <Menu/> */}
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
        >
          {cards.map(renderCard)}
          <Link href="/about-us" asChild>
            <TouchableOpacity 
              style={styles.aboutUsButton}
              accessibilityLabel="About Us"
            >
              <Text style={styles.aboutUsText}>About Us</Text>
            </TouchableOpacity>
          </Link>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#07477B',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#c0cacb',
  },
  logo: {
    width: 120,
    height: 63,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 15,
  },
  scrollContent: {
    padding: 10,
  },
  card: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    height: height * 0.135,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    padding: 18,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  playButton: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#c0cacb',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  aboutUsButton: {
    backgroundColor: '#07477B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  aboutUsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    paddingVertical: 0,
    height: '100%',
  },
});