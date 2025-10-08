import { useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  reload
} from 'firebase/auth';
import { AuthContext } from './authContextConstants';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate .edu email
  const isValidEduEmail = (email) => {
    return email.endsWith('.edu');
  };

  // Sign up with .edu email validation
  const signup = async (email, password) => {
    if (!isValidEduEmail(email)) {
      throw new Error('Please use a valid .edu email address');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    return userCredential;
  };

  // Sign in
  const login = async (email, password) => {
    if (!isValidEduEmail(email)) {
      throw new Error('Please use a valid .edu email address');
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
      await signOut(auth); // Sign out the user immediately
      throw new Error('Please verify your email before logging in.');
    }
    return userCredential;
  };

  // Sign out
  const logout = () => {
    return signOut(auth);
  };

  // Password Reset
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Send verification email
  const sendVerificationEmail = (user) => {
    return sendEmailVerification(user);
  };

  const reloadUser = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      // The onAuthStateChanged listener will handle the user update
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    sendVerificationEmail,
    reloadUser,
    isValidEduEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
