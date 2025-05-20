import auth from '@react-native-firebase/auth';
import  firestore  from '@react-native-firebase/firestore';

export const signUp = async (email, password, name) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      // Store user data in Firestore
      await firestore().collection('users').doc(user.uid).set({
        uid: user.uid,
        name,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
  
      return user;
    } catch (error) {
        console.log(error);
      throw error;
    }
  };



// Login function
export const login = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    // Return the user object
    return userCredential.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Optional: Add a function to check if a user is authenticated
export const checkAuthState = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const resetPassword = async (email) => {
  try {
    await auth().sendPasswordResetEmail(email);
    return 'Password reset email sent!';
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  await auth().signOut();
};