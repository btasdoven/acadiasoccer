import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const { authUser } = useAuth();

  if (authUser) {
    return children;
  }

  return <Navigate replace to="/login" />;
}

export default PrivateRoute;
