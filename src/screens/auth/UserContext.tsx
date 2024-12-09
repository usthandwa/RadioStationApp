// context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, View, TextInput, Button } from 'react-native';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {}
});

export const UserProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        // Verify token and get user data
        const userData = await verifyToken(token);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // For demo, auto-login admin
      if (email === 'zanelengwenyama@gmail.com') {
        const adminUser = {
          email,
          role: Role.ADMIN,
          // Add permissions as defined earlier
        };
        await AsyncStorage.setItem('auth_token', 'demo_token');
        await AsyncStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user');
    setUser(null);
  };

//   return (
//     <UserContext.Provider value={{ user, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// screens/Login.tsx
export const LoginScreen = () => {
  useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login failed');
    }
  };

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

function verifyToken(token: string) {
    throw new Error('Function not implemented.');
}


function setUser(userData: any) {
    throw new Error('Function not implemented.');
}
