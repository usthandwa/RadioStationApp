import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Dimensions, Platform, StatusBar, Alert, Animated, Easing, RefreshControl, Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import Icon from '@expo/vector-icons/FontAwesome5';
import * as Haptics from 'expo-haptics';
import SocialScreen from './SocialScreen';
import { setupPlayer, togglePlayback, usePlaybackState } from '../components/trackPlayerServices';


const { height } = Dimensions.get('window');

interface CardData {
  id: string;
  title: string;
  description: string;
  imageSrc: any;
  contentType: string;
  isListenLive?: boolean;
}

const cardsData: CardData[] = [
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
];

export default function HomeScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const playbackState = usePlaybackState();
  const spinValue = useRef(new Animated.Value(0)).current;

  // Animation values for cards
  const fadeAnims = useRef(cardsData.map(() => new Animated.Value(0))).current;
  const scaleAnims = useRef(cardsData.map(() => new Animated.Value(1))).current;

  // Animate cards on mount
  useEffect(() => {
    const animations = fadeAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      })
    );
    Animated.stagger(50, animations).start();
  }, [fadeAnims]);

  const startSpinAnimation = useCallback(() => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const stopSpinAnimation = useCallback(() => {
    spinValue.stopAnimation();
    spinValue.setValue(0);
  }, [spinValue]);

  const handleTogglePlay = useCallback(async () => {
    if (isLoading) return;

    // Haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

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
  }, [isLoading, startSpinAnimation, stopSpinAnimation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Add haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Simulate refresh - you can add actual data fetching here
    await new Promise(resolve => setTimeout(resolve, 1000));

    setRefreshing(false);
  }, []);

  const handleCardPressIn = useCallback((index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [scaleAnims]);

  const handleCardPressOut = useCallback((index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [scaleAnims]);

  const renderCard = useCallback((card: CardData, index: number) => {
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        key={card.id}
        style={[
          styles.cardWrapper,
          {
            opacity: fadeAnims[index],
            transform: [{ scale: scaleAnims[index] }],
          }
        ]}
      >
        <Pressable
          style={styles.card}
          onPress={() => {
            if (Platform.OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            if (card.title !== 'Socials') {
              router.push({
                pathname: `/${card.contentType}` as any,
                params: { title: card.title }
              });
            }
          }}
          onPressIn={() => handleCardPressIn(index)}
          onPressOut={() => handleCardPressOut(index)}
        >
          <Image source={card.imageSrc} style={styles.cardImage} />
          <View style={styles.cardOverlay}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
            </View>
            {card.isListenLive && (
              <TouchableOpacity
                style={styles.playButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleTogglePlay();
                }}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                {isLoading ? (
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Icon name="spinner" size={44} color="#fff" />
                  </Animated.View>
                ) : (
                  <Icon
                    name={playbackState === 'playing' ? 'pause' : 'play'}
                    size={44}
                    color="#fff"
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
        </Pressable>
      </Animated.View>
    );
  }, [router, handleTogglePlay, playbackState, isLoading, spinValue, fadeAnims, scaleAnims, handleCardPressIn, handleCardPressOut]);

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
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#07477B"
              colors={['#07477B']}
            />
          }
        >
          {cardsData.map((card, index) => renderCard(card, index))}
          <Link href="/about-us" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.aboutUsButton,
                pressed && styles.aboutUsButtonPressed
              ]}
              onPress={() => {
                if (Platform.OS === 'ios') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
              }}
            >
              <Text style={styles.aboutUsText}>About Us</Text>
              <Icon name="arrow-right" size={16} color="#fff" style={styles.aboutUsIcon} />
            </Pressable>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#07477B',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  logo: {
    width: 100,
    height: 53,
    resizeMode: 'contain',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    height: height * 0.125,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 16,
    justifyContent: 'space-between',
  },
  cardTextContainer: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 15,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontWeight: '500',
  },
  playButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#07477B',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  aboutUsButton: {
    backgroundColor: '#07477B',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  aboutUsButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  aboutUsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  aboutUsIcon: {
    marginLeft: 8,
  },
  socialContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingVertical: 0,
  },
});
