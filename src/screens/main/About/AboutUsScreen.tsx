import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';

const AboutUsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>About Us</Text>
      <Text style={styles.content}>
        Adventist World Radio SIDmedia(AWRSIDmedia), is a non-profit Bible-based
        Christian Broadcast Ministry, an institute of the Southern Africa-Indian Ocean Division of the
        Seventh-day Adventist Church. 
        </Text>
        <Text style={styles.content}>
        We are dedicated to sharing messages of hope and faith across the world. 
      </Text>
      <Text style={styles.subtitle}>Our mission</Text> 
      <Text style={styles.content}>
      
         To make disciples of Jesus Christ who live as His loving witnesses and proclaim to all people the everlasting gospel of the Three Angels’ Messages in preparation for His soon return (Matt 28:18-20, Acts 1:8, Rev 14:6-12).
      </Text>
      <Text style={styles.subtitle}>Contact us:</Text>
      <Text style={styles.link} onPress={() => Linking.openURL('mailto:awr@sidmedia.org')}>
        Email: awr@sidmedia.org
      </Text>
      <Text style={styles.link} onPress={() => Linking.openURL('https://wa.me/message/7BRWFRE3O3YVB1')}>
        WhatsApp: +27 73 470 3520
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#c0cacb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#07477B',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#07477B',
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
});

export default AboutUsScreen;