import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerNavigationProp
} from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/native';

type DrawerItemProps = {
  name: string;
  route: string;
  params?: object;
};

const DrawerItem: React.FC<DrawerItemProps & { navigation: any }> = ({ name, route, params, navigation }) => (
  <TouchableOpacity
    style={styles.drawerItem}
    onPress={() => {
      if (params) {
        navigation.navigate(route, params);
      } else {
        navigation.navigate(route);
      }
      navigation.closeDrawer();
    }}
  >
    <Text style={styles.drawerItemText}>{name}</Text>
  </TouchableOpacity>
);

const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const pages: DrawerItemProps[] = [
    { name: 'Home', route: 'MainStack' },
    { name: 'Live Stream', route: 'MainStack', params: { screen: 'LiveStream' } },
    { name: 'Give', route: 'MainStack', params: { screen: 'Give' } },
    { name: 'Prayer', route: 'MainStack', params: { screen: 'Prayer' } },
    { name: 'Social', route: 'MainStack', params: { screen: 'Social' } },
    { name: 'Podcasts', route: 'MainStack', params: { screen: 'Podcasts' } },
    { name: 'About Us', route: 'AboutUs' },
  ];

  // Use type assertion here
  const navigation = props.navigation as unknown as DrawerNavigationProp<ParamListBase>;

  return (
    <DrawerContentScrollView {...props}>
      {pages.map((page) => (
        <DrawerItem key={page.name} {...page} navigation={navigation} />
      ))}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  drawerItemText: {
    fontSize: 16,
  },
});

export default DrawerContent;