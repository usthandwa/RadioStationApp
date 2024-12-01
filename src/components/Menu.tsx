import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

const Menu = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const menuItems = [
    { route: '/live-stream', title: 'Live Stream' },
    { route: '/give', title: 'Give' },
    { route: '/prayer', title: 'Prayer' },
    { route: '/podcasts', title: 'Podcasts' },
    { route: '/about-us', title: 'About Us' }
  ];

  const handleNavigation = (route: string) => {
    setIsVisible(false);
    router.push(route);
  };

  return (
    <>
      <TouchableOpacity 
        onPress={() => setIsVisible(true)}
        accessibilityLabel="Menu"
      >
        <Icon name="bars" size={24} color="#07477B" />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
            >
              <Icon name="times" size={24} color="#07477B" />
            </TouchableOpacity>
            
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleNavigation(item.route)}
              >
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuText: {
    fontSize: 18,
    color: '#07477B',
    textAlign: 'center',
  }
});

export default Menu;