// types/auth.ts
export enum Role {
    ADMIN = 'admin',
    CREATOR = 'creator',
    CONTENT_UPDATER = 'content_updater'
  }
  
  export interface Show {
    id: number;
    title: string;
    synopsis: string;
    imageUrl: string;
    presenterId: number;
  }

  export interface Permission {
    action: 'create' | 'read' | 'update' | 'delete';
    resource: 'shows' | 'presenters' | 'users' | 'content' | 'settings';
  }
  
  export interface User {
    email: string;
    role: Role;
    permissions: Permission[];
  }

  export const usePermission = () => {
    const { user } = React.useContext(UserContext);
    return (action: string, resource: string) => {
      if (!user) return false;
      //return user.permissions.includes(`${action}:${resource}`);
    };
  };
  
  // services/authService.ts
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import axios from 'axios';
  
  const INITIAL_ADMIN = {
    email: 'zanelengwenyama@gmail.com',
    role: Role.ADMIN,
    permissions: [
      { action: 'create', resource: 'shows' },
      { action: 'read', resource: 'shows' },
      { action: 'update', resource: 'shows' },
      { action: 'delete', resource: 'shows' },
      { action: 'create', resource: 'users' },
      { action: 'update', resource: 'users' },
      { action: 'delete', resource: 'users' },
      { action: 'update', resource: 'settings' }
    ]
  };
  
  const ROLE_PERMISSIONS = {
    [Role.CREATOR]: [
      { action: 'create', resource: 'shows' },
      { action: 'update', resource: 'shows' },
      { action: 'read', resource: 'shows' }
    ],
    [Role.CONTENT_UPDATER]: [
      { action: 'update', resource: 'shows' },
      { action: 'read', resource: 'shows' }
    ]
  };
  
  export const checkPermission = (user: User, action: string, resource: string): boolean => {
    if (user.role === Role.ADMIN) return true;
    return user.permissions.some(
      permission => permission.action === action && permission.resource === resource
    );
  };
  
  export const initializeAuth = async () => {
    try {
      const existingAdmin = await AsyncStorage.getItem('admin_user');
      if (!existingAdmin) {
        await AsyncStorage.setItem('admin_user', JSON.stringify(INITIAL_ADMIN));
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    }
  };
  
  // Hook for checking permissions
   import { useContext } from 'react';
import { updateShow } from '../services/cmsApi';
import { UserContext } from '../context/UserContext';
import React from 'react';
  
 /* export const usePermission = () => {
    const user = useContext(UserContext);
    
    return (action: string, resource: string) => 
      checkPermission(user, action, resource);
  }; */
  
  // Usage in components
/*   const ContentEditor = () => {
    const hasPermission = usePermission();
    
    if (!hasPermission('update', 'shows')) {
      return <Text>Access denied</Text>;
    }
    
    return (
      // Editor component
    );
  }; */
  
  // Example API wrapper with permission checks
  export const secureApi = {
    updateShow: async (user: User, showId: number, data: any) => {
      if (!checkPermission(user, 'update', 'shows')) {
        throw new Error('Permission denied');
      }
      return await updateShow(showId, data);
    },
    
    createUser: async (adminUser: User, newUserData: any) => {
      if (adminUser.role !== Role.ADMIN) {
        throw new Error('Only admins can create users');
      }
      // Create user logic
    }
  };