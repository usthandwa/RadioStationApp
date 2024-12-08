import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Dimensions, Platform, StatusBar, Alert, Animated, Easing } from 'react-native';
import { useRouter, Link } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import SocialScreen from './SocialScreen';
import { setupPlayer, togglePlayback, usePlaybackState } from '../components/trackPlayerServices';


const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isLoading, setIsLoading] = useState(false);
  const playbackState = usePlaybackState();
  const spinValue = useRef(new Animated.Value(0)).current;

  interface CardData {
    id: string;
    title: string;
    description: string;
    imageSrc: any;
    contentType: string;
    isListenLive?: boolean;
  }

  const [cards, setCards] = useState<CardData[]>([
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
  },
  // {
  //   id: '6',
  //   title: "Listen Live Test",
  //   description: "Tune into our live broadcast",
  //   imageSrc: require('../assets/Listen_Live.jpg'),
  //   contentType: 'LiveStreamVisualTester',
  // },
  ]);

  const startSpinAnimation = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopSpinAnimation = () => {
    spinValue.stopAnimation();
    spinValue.setValue(0);
  };

  const handleTogglePlay = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    startSpinAnimation();

    try {
      await togglePlayback();
    } catch (error) {
      console.error('Error handling audio:', error);
      Alert.alert('Audio Error', 'Unable to play the audio. Please try again later.');
    } finally {
      setIsLoading(false);
      stopSpinAnimation();
    }
  }, [isLoading]);

  const renderCard = useCallback((card: CardData) => {
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <TouchableOpacity 
        key={card.id}
        style={styles.card} 
        onPress={() => {
          if (card.title === 'Socials') {
            // Handle Socials card separately if needed
          } else {
            router.push({
              pathname: `/${card.contentType}`,
              params: { title: card.title }
            });
          }
        }}
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
          {/* {card.title === 'Socials' && <SocialScreen />} */}
          {card.title === 'Socials' && (
  <View style={styles.socialContainer}>
    <SocialScreen />
  </View>
)}
        </View>
      </TouchableOpacity>
    );
  }, [router, handleTogglePlay, playbackState, isLoading, spinValue]);

  // Initialize the player when the component mounts
  useEffect(() => {
    setupPlayer();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home</Text>
          <Image
            source={require('../assets/awr_sidmedia_logo.png')}
            style={styles.logo}
          />
          <TouchableOpacity onPress={() => router.push('/menu')}>
            <Icon name="bars" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
        >
          {cards.map(renderCard)}
          <Link href="/about-us" asChild>
            <TouchableOpacity style={styles.aboutUsButton}>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#07477B',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    logo: {
        width: 100,
        height: 53,
        resizeMode: 'contain',
    },
    scrollContent: {
        padding: 10,
    },
    card: {
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden',
        height: height * 0.139,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        padding: 5,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    cardDescription: {
        fontSize: 14,
        color: '#fff',
    },
   playButton: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    backgroundColor: 'none',//'#07477B',
    width: 60,  // Increased size
    height: 60, // Increased size
    borderRadius: 30, // Adjusted for new size
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
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
    },
    aboutUsText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    socialContainer: {
      // flex: 1,
      // height: 50,
      justifyContent: 'center',
      alignItems: 'stretch',
      paddingVertical: 0,
    },
});