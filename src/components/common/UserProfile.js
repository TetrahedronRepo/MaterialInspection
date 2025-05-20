import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const UserProfile = ({ userData }) => {
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes, Logout",
          onPress: async () => {
            try {
              await auth().signOut();
            } catch (error) {
              console.error("Error logging out:", error);
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleLogout}>
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {userData?.displayName 
              ? userData.displayName.charAt(0).toUpperCase() 
              : userData?.email?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.userName} numberOfLines={1}>
          {userData?.displayName || userData?.email || 'User'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  userName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    maxWidth: 120,
    overflow: 'hidden',
    marginLeft: 4,
  }
});

export default UserProfile;