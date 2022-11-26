import React, { useContext } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import UpdateProfile from '../pages/UpdateProfile';
import { useEffect } from "react";

const UserContext = React.createContext();

const UserProviderInt = ({ children, authUser }) => {
  const firestore = useFirestore();

  const ref = doc(firestore, 'users', authUser.uid);
  const ret = useFirestoreDocData(ref);
  const { status, data: user } = ret;
  const loaded = user !== undefined;

  if (status === 'success' && !user) {
    // user logged in but its profile not yet created in db
    return (
      <UpdateProfile />
    )
  }

  const value = {
    status, user
  };

  return (
    <UserContext.Provider value={value}>
      {!loaded && 
        <Container
          className="d-flex align-items-center justify-content-center app-mh-100"
          style={{ position: 'absolute', top: 0, left: 0, minWidth: "100vw" }}
        >
          <Spinner animation="border" variant="primary" />
        </Container>
      }
      {loaded && children}
    </UserContext.Provider>
  );
};

export function UserProvider({ children }) {
  const { authUser } = useAuth();

  if (authUser) {
    // User is authenticated. 
    return <UserProviderInt children={children} authUser={authUser} />
  }

  //
  // If no auth, then no user as well.
  //

  const value = {
    status: "success", user: undefined
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useFirestoreUser() {
  return useContext(UserContext);
}