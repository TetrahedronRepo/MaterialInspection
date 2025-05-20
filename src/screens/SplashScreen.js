import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    
    // Simulate a loading process, then navigate to Home or Login
    const timeout = setTimeout(() => {
      navigation.replace('Login'); // Replace 'Home' with the screen you want to navigate to
    }, 2000); // 2-second delay

    return () => clearTimeout(timeout); // Clean up the timeout
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Welcome</Text>
      <Image source={require('../assets/logo/CMR.png')} style={styles.logo}/>
      <Text style={styles.title}>Incoming Material Inspection</Text>
      <Text style={styles.tagtitle}>Powered by</Text>
      <Text style={styles.comtitle}>Tretrahedron Manufacturing Services Pvt. Ltd.</Text>
      <ActivityIndicator size="large" color="#6200ee" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'fff',
  },
  subtitle: {
    fontSize: 24,
    color: '#000',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  tagtitle: {
    backgroundColor:'#6200ee',
    padding: 10,
    fontSize: 15,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  comtitle: {
    fontSize: 15,
    color: 'red',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 30,
    color: '#000',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
