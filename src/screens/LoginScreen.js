import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { login } from '../firebase/firebaseAuth';



const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    setLoading(true); // Show loading state

    try {
      const user = await login(email, password);
      Alert.alert('Success', `Welcome back ${user.email}`);
      // Navigate to the home screen or dashboard
      navigation.replace('Home'); // Adjust 'Home' to your intended screen
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Error', 'User not found. Please check your credentials.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Incorrect password.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Invalid email address.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginbox}>
        <Text style={styles.title}>Admin Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.buttonT}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>
              {loading ? 'Logging In...' : 'Login'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#9C27B0',
  },
  loginbox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  buttonT: {
    flexDirection: 'row',
    width: '100%',
    fontSize: 16,
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#9C27B0',
    paddingVertical: 15,
    width: '40%',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { useAuth } from '../context/AuthContext';
// import Button from '../components/common/Button';

// const LoginScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLogin, setIsLogin] = useState(true);
//   const { login, register, loginAnonymously, loading, isAuthenticated } = useAuth();

//   useEffect(() => {
//     // If already authenticated, redirect to the employee details screen
//     if (isAuthenticated) {
//       navigation.replace('Home');
//     }
//   }, [isAuthenticated, navigation]);

//   const handleAuth = async () => {
//     // Simple validation
//     if (!email && !isLogin) {
//       Alert.alert('Error', 'Please enter an email address');
//       return;
//     }
    
//     if (!password && !isLogin) {
//       Alert.alert('Error', 'Please enter a password');
//       return;
//     }
    
//     if (isLogin) {
//       // Handle login
//       await login(email, password);
//     } else {
//       // Handle registration
//       if (password.length < 6) {
//         Alert.alert('Error', 'Password must be at least 6 characters');
//         return;
//       }
//       await register(email, password);
//     }
//   };

//   const handleAnonymousLogin = async () => {
//     await loginAnonymously();
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#1e3a8a" />
//         <Text style={styles.loadingText}>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <View style={styles.logoContainer}>
//           <Text style={styles.appTitle}>Endurance Dojo</Text>
//           <Text style={styles.appSubtitle}>Defect Detection Training</Text>
//         </View>

//         <View style={styles.formContainer}>
//           <Text style={styles.headerText}>{isLogin ? 'Login' : 'Create Account'}</Text>

//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             placeholderTextColor="#888"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />

//           <TextInput
//             style={styles.input}
//             placeholder="Password"
//             placeholderTextColor="#888" 
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//           />

//           <Button
//             title={isLogin ? 'Login' : 'Register'}
//             onPress={handleAuth}
//             style={styles.authButton}
//           />

//           <TouchableOpacity
//             style={styles.switchButton}
//             onPress={() => setIsLogin(!isLogin)}>
//             <Text style={styles.switchText}>
//               {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
//             </Text>
//           </TouchableOpacity>

//           <View style={styles.divider}>
//             <View style={styles.line} />
//             <Text style={styles.orText}>OR</Text>
//             <View style={styles.line} />
//           </View>

//           <Button
//             title="Continue as Guest"
//             onPress={handleAnonymousLogin}
//             style={styles.anonymousButton}
//           />
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginTop: 60,
//     marginBottom: 40,
//   },
//   appTitle: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#1e3a8a',
//   },
//   appSubtitle: {
//     fontSize: 16,
//     color: '#666',
//     marginTop: 5,
//   },
//   formContainer: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 10,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     padding: 12,
//     marginBottom: 16,
//     fontSize: 16,
//   },
//   authButton: {
//     marginTop: 10,
//   },
//   switchButton: {
//     marginTop: 15,
//     alignItems: 'center',
//   },
//   switchText: {
//     color: '#1e3a8a',
//     fontSize: 16,
//   },
//   divider: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   line: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#ddd',
//   },
//   orText: {
//     marginHorizontal: 10,
//     color: '#666',
//   },
//   anonymousButton: {
//     backgroundColor: '#6c757d',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//   },
// });

// export default LoginScreen;