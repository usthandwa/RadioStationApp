import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

const PrayerScreen: React.FC = () => {
  const openWhatsApp = async () => {
    const url = 'https://api.whatsapp.com/send?phone=19498607007&text=sid7pray';
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open this URL: " + url);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Prayer Requests</Text>
      <Text style={styles.text}>
        Are you in need of prayer and support? We invite you to share your prayer requests with us.
      </Text>
      <Text style={styles.text}>
        Whether you're facing challenges, seeking guidance, or simply needing comfort, our community is here to pray for you. Through the power of prayer, we can find strength and hope together.
      </Text>
      <Text style={styles.text}>
        Don't hesitate - send us your prayer requests now.
      </Text>
      <Text style={styles.text}>
        Let us be a source of support in your time of need. Remember, you're never alone. Share your burdens and experience the power of collective prayer.
      </Text>
      <TouchableOpacity style={styles.button} onPress={openWhatsApp}>
        <Text style={styles.buttonText}>Click here to connect via WhatsApp</Text>
      </TouchableOpacity>
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
    textAlign: 'center',
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 24,
    color: '#444',
  },
  button: {
    backgroundColor: '#25D366', // WhatsApp green color
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PrayerScreen;