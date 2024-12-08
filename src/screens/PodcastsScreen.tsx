import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';

// Conditional import for WebView
let WebView: any;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

interface Podcast {
  id: string;
  name: string;
  iframeHtml: string;
  time?: string;
}

const PodcastsScreen: React.FC = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [selectedPodcastId, setSelectedPodcastId] = useState<string | null>(null);
  const { width: screenWidth } = useWindowDimensions();

  useEffect(() => {
    const podcastData: Podcast[] = [
      { 
        id: '7370', 
        name: 'Mid Morning Empowerment', 
        iframeHtml: '<iframe src="https://iframe.iono.fm/c/7370?background=c0cacb&accent=07477B" width="100%" height="450" frameborder="0" referrerpolicy="origin" loading="lazy"></iframe>',
        time: '09:00'
      },
      { 
        id: '7381', 
        name: 'Glorius Morning', 
        iframeHtml: '<iframe src="https://iframe.iono.fm/c/7381?background=c0cacb&accent=07477B" width="100%" height="450" frameborder="0" referrerpolicy="origin" loading="lazy"></iframe>',
        time: '06:00'
      },
      { 
        id: '7658', 
        name: 'Business Sense', 
        iframeHtml: '<iframe src="https://iframe.iono.fm/c/7658?background=c0cacb&accent=07477B" width="100%" height="450" frameborder="0" referrerpolicy="origin" loading="lazy"></iframe>',
        time: '18:00'
      },
      { 
        id: '7385', 
        name: 'Maranatha Drive', 
        iframeHtml: '<iframe src="https://iframe.iono.fm/c/7385?background=c0cacb&accent=07477B" width="100%" height="450" frameborder="0" referrerpolicy="origin" loading="lazy"></iframe>',
        time: '15:00'
      },
      { 
        id: '8226', 
        name: 'Live', time: '12:00',
        iframeHtml: '<iframe src="https://iframe.iono.fm/c/8226?background=c0cacb&accent=07477B" width="100%" height="450" frameborder="0" referrerpolicy="origin" loading="lazy"></iframe>'
      },
      { 
        id: '7444', 
        name: 'Bible Perspective', 
        iframeHtml: '<iframe src="https://iframe.iono.fm/c/7444?background=c0cacb&accent=07477B" width="100%" height="450" frameborder="0" referrerpolicy="origin" loading="lazy"></iframe>',
        time: '18:00'
      },
      { 
        id: '7580', 
        name: 'Pastor Oetla Simankane series', 
        iframeHtml: '<iframe src="https://iframe.iono.fm/c/7580?background=c0cacb&accent=07477B" width="100%" height="450" frameborder="0" referrerpolicy="origin" loading="lazy"></iframe>'
      },
      { 
        id: '8248', 
        name: 'Sinai', 
        iframeHtml: '<iframe src="https://iframe.iono.fm/c/8248?background=c0cacb&accent=07477B" width="100%" height="450" frameborder="0" referrerpolicy="origin" loading="lazy"></iframe>'
      },
      { 
        id: '8205', 
        name: 'Best Of AWR SIDmedia', 
        iframeHtml: '<iframe src="https://iframe.iono.fm/c/8205?background=c0cacb&accent=07477B&border=07477b" width="100%" height="450" loading="lazy" referrerpolicy="origin" frameborder="0"></iframe>'
      },
    ];

    // Sort podcasts: those with times first, sorted by time, then the rest
    const sortedPodcasts = podcastData.sort((a, b) => {
      if (a.time && b.time) return a.time.localeCompare(b.time);
      if (a.time) return -1;
      if (b.time) return 1;
      return Math.random() - 0.5;
    });

    setPodcasts(sortedPodcasts);
  }, []);

  const togglePodcast = (podcastId: string) => {
    setSelectedPodcastId(prevId => prevId === podcastId ? null : podcastId);
  };

  const renderIframe = useCallback((iframeHtml: string) => {
    if (Platform.OS === 'web') {
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: iframeHtml }} 
          style={styles.webIframe} 
        />
      );
    } else {
      return (
        <WebView
          source={{
            html: `
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body, html {
                      margin: 0;
                      padding: 0;
                      height: 100%;
                      overflow: hidden;
                      background:#c0cacb;
                    }
                    .iframe-container {
                      position: relative;
                      width: 100%;
                      padding-bottom: 56.25%; /* 16:9 aspect ratio */
                      height: 0;
                    }
                    .iframe-container iframe {
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 100%;
                      height: 100%;
                      
                    }
                  </style>
                </head>
                <body>
                  <div class="iframe-container">
                    ${iframeHtml}
                  </div>
                </body>
              </html>
            `
          }}
          style={styles.webview}
          scalesPageToFit={false}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          scrollEnabled={false}
        />
      );
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Podcasts</Text>
        <Text style={styles.description}>
          Catch up with the shows you missed and more...
        </Text>
        {podcasts.map((podcast) => (
          <View key={podcast.id}>
            <TouchableOpacity
              style={[
                styles.podcastItem,
                selectedPodcastId === podcast.id && styles.selectedPodcast
              ]}
              onPress={() => togglePodcast(podcast.id)}
            >
              <Text style={styles.podcastName}>{podcast.name}</Text>
              {podcast.time && <Text style={styles.podcastTime}>{podcast.time}</Text>}
            </TouchableOpacity>
            {selectedPodcastId === podcast.id && (
              <View style={[styles.iframeContainer, { width: screenWidth - 40 }]}>
                {renderIframe(podcast.iframeHtml)}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c0cacb',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  podcastItem: {
    backgroundColor: '#9ca3a9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedPodcast: {
    backgroundColor: '#e6f7ff',
    borderColor: '#1890ff',
    borderWidth: 1,
  },
  podcastName: {
    fontSize: 16,
    fontWeight: '500',
  },
  podcastTime: {
    fontSize: 14,
    color: '#666',
  },
  iframeContainer: {
    height: 250,
    marginTop: 10,
    marginBottom: 20,
  },
  webview: {
    flex: 1,
  },
  webIframe: {
    width: '100%',
    height: '100%',
    backgroundColor: '#c0cacb',
  },
});

export default PodcastsScreen;