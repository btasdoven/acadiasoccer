import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import './scss/theme.scss';

import { AuthProvider } from "../src/context/AuthContext";
import { UserProvider } from "../src/context/UserContext";

import { getFirestore } from 'firebase/firestore';
import { FirebaseAppProvider, FirestoreProvider, useFirebaseApp } from 'reactfire';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

function FirebaseComponents() {
  const app = useFirebaseApp(); 
  const database = getFirestore(app);
  // const auth = getAuth(app);

  return (
    <AuthProvider>
      <FirestoreProvider sdk={database}>
          <UserProvider>
            <App />
          </UserProvider>
      </FirestoreProvider>
    </AuthProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <FirebaseComponents />
      </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
