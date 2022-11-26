import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut,
  RecaptchaVerifier, signInWithPhoneNumber  } from "firebase/auth";

const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState();

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  const loginWithPhoneNumber = (phoneNumber) => {

    if (!window.recaptchaVerifier)
    {
      window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', { 'size': 'invisible' }, auth);
    }

    return signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
  }

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    authUser,
    signup,
    login,
    logout,
    resetPassword,
    loginWithPhoneNumber,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}