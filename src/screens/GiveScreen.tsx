import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const BulletPointList = () => {
  const bulletPoints = [
    { text: 'Bible Studies', icon: 'bible' },
    { text: 'Global Programming Initiative', icon: 'globe' },
    { text: 'Development & Production', icon: 'film' },
    { text: 'Distribution Methods', icon: 'broadcast-tower' },
    { text: 'Studio Services, Equipment, Sets & Maintenance', icon: 'video' },
  ];

  return (
    <View style={styles.bulletPoints}>
      {bulletPoints.map((point, index) => (
        <View key={index} style={styles.bulletPointContainer}>
          <Icon name={point.icon} size={16} color="#07477B" style={styles.icon} />
          <Text style={styles.bulletPoint}>{point.text}</Text>
        </View>
      ))}
    </View>
  );
};

const GiveScreen: React.FC = () => {
  const donationOptions = [
    { amount: 50, description: "Sponsor 1 radio program" },
    { amount: 100, description: "Sponsor 2 radio programs" },
    { amount: 250, description: "Sponsor 5 radio programs" },
    { amount: 500, description: "Sponsor 10 radio programs" },
    { amount: 1000, description: "Sponsor 20 radio programs" },
  ];

  const handleDonate = (amount: number) => {
    Linking.openURL(`https://www.sidmedia.org/product/r${amount}-donation/`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Give</Text>
      <TouchableOpacity onPress={() => Linking.openURL('https://sidmedia.org/donations/')}>
        <Text style={styles.subtitle}>Partner with us</Text>
      </TouchableOpacity>
      
      <Text style={styles.description}>
        From the radio to social media to in-person evangelism, Adventist World Radio SIDmedia is sharing messages of hope in every corner of the world.
      </Text>
      <Text style={styles.description}>
        Your gift will be used where the need is greatest and will turn compassion into action.
      </Text>
      <Text style={styles.subheader}>Choose a donation amount:</Text>
      {donationOptions.map((option, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.donationButton}
          onPress={() => handleDonate(option.amount)}
        >
          <Text style={styles.donationButtonText}>
            R{option.amount} - {option.description}
          </Text>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity 
        style={styles.customDonationButton}
        onPress={() => Linking.openURL('https://www.sidmedia.org/product/r-own/')}
      >
        <Text style={styles.customDonationButtonText}>
          Custom Amount
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.subheader}>Your donation will go towards:</Text>
      <BulletPointList />
      
      <Text style={styles.description}>
        Let us together with YOU take the name of Jesus to the hearts of this great world!
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#07477B',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    color: '#07477B',
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 24,
  },
  subheader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#07477B',
  },
  bulletPoints: {
    marginLeft: 10,
    marginBottom: 15,
  },
  bulletPointContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    marginRight: 10,
    width: 20,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  donationButton: {
    backgroundColor: '#07477B',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  donationButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  customDonationButton: {
    backgroundColor: 'white',
    borderColor: '#07477B',
    borderWidth: 2,
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 30,
  },
  customDonationButtonText: {
    color: '#07477B',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default GiveScreen;