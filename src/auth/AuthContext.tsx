import ErrorScreen from "@/components/error/404";
import { gql, useLazyQuery } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useState, useContext, useEffect } from "react";

// Create the Auth Context
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null); // Store the authenticated user
  const urlParams = new URLSearchParams(window.location.search);
  const _token = urlParams.get("token");
  const [token, setToken] = useState(_token);

  // console.log("token", token);

  if (!token) {
    return <ErrorScreen type="404" />;
  }

  let tokenDetails: any;

  try {
    if (token) {
      tokenDetails = jwtDecode(token);
    }
  } catch (error) {
    setToken(null);
  }

  // Function to log out the user
  const logout = () => {
    setUser(null);
    // setToken(null); // Remove token from memory
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        logout,
        tokenDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
