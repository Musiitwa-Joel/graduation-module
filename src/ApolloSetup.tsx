import React from "react";
import { ApolloProvider } from "@apollo/client";
import { useAuth } from "./auth/AuthContext";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const ApolloSetup = ({ children }) => {
  const { token } = useAuth(); // Get token from AuthContext

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
      // "x-portal-type": "student",
    },
  }));

  const httpLink = new HttpLink({
    uri: "http://192.168.1.189:2323/graphql",
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authLink, httpLink]),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloSetup;
