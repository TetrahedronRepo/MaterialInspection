// AuthContext.js - Create this file in your context folder
import React, { createContext, useState, useEffect, useContext } from 'react';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    setLoading(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Login with email and password
  const login = async (email, password) => {
    try {
      setLoading(true);
      await auth().signInWithEmailAndPassword(email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message);
      setLoading(false);
      return false;
    }
  };

  // Register with email and password
  const register = async (email, password) => {
    try {
      setLoading(true);
      await auth().createUserWithEmailAndPassword(email, password);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registration Failed', error.message);
      setLoading(false);
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Failed', error.message);
    }
  };

  // Anonymous login for quick testing
  const loginAnonymously = async () => {
    try {
      setLoading(true);
      await auth().signInAnonymously();
      return true;
    } catch (error) {
      console.error('Anonymous login error:', error);
      Alert.alert('Login Failed', error.message);
      setLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loginAnonymously,
        isAuthenticated: !!user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);