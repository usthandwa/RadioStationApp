import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface SocialLink {
  platform: string;
  nativeIcon: string;
  customIcon: any;
  url: string;
}

const SocialIcon: React.FC<{ nativeIcon: string; customIcon: any }> = ({ nativeIcon, customIcon }) => {
  try {
    return <Icon name={nativeIcon} size={20} color="#07477B" />;
  } catch (error) {
    return <Image source={customIcon} style={styles.icon} />;
  }
};

const SocialScreen: React.FC = () => {
  const socialLinks: SocialLink[] = [
    { platform: 'Facebook', customIcon: require('../assets/icons8-facebook-48-2.png'), nativeIcon: 'facebook', url: 'https://www.facebook.com/sidmedia' },
    { platform: 'Twitter', nativeIcon: 'twitter', customIcon: require('../assets/twitter-icon.png'), url: 'https://twitter.com/thesidmedia' },
    { platform: 'Instagram', nativeIcon: 'instagram', customIcon: require('../assets/instagram-icon.png'), url: 'https://www.instagram.com/thesidmedia' },
    { platform: 'YouTube', nativeIcon: 'youtube', customIcon: require('../assets/youtube-icon.png'), url: 'https://www.youtube.com/@thesidmedia4110' },
    { platform: 'WhatsApp', nativeIcon: 'whatsapp', customIcon: require('../assets/whatsapp-icon.png'), url: 'https://wa.me/message/7BRWFRE3O3YVB1' },
    { platform: 'TikTok', nativeIcon: 'tiktok', customIcon: require('../assets/tiktok-icon.png'), url: 'https://www.tiktok.com/@the_sidmedia' },
  ];

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error(`Don't know how to open this URL: ${url}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {socialLinks.map((social, index) => (
          <TouchableOpacity
            key={index}
            style={styles.iconButton}
            onPress={() => openLink(social.url)}
          >
            <SocialIcon customIcon={social.customIcon} nativeIcon={social.nativeIcon} />
            <Text style={styles.iconText}>{social.platform}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '65%', // Adjust this value to fit your layout
    height: 70, // Adjust this value based on your card height
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '33.33%', // This ensures 3 icons per row
    height: '50%', // This ensures 2 rows
    paddingVertical: 0,
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  iconText: {
    marginTop: 1,
    fontSize: 8,
    color: '#07477B',
    textAlign: 'center',
  },
});

export default SocialScreen;