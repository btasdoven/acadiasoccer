import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function UnsignedRoute({ children }) {
  const { authUser } = useAuth();
  
  if (!authUser) {
    return children;
  }

  return <Navigate replace to="/games" />;
}

export default UnsignedRoute;
