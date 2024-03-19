import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import "./App.css";

import Header from "./components/header";
import Auth from "./utils/auth";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("id_token") !== null
  );

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("id_token");
      if (token && Auth.isTokenExpired(token)) {
        // Utilize Auth.isTokenExpired function
        localStorage.removeItem("id_token");
        setIsAuthenticated(false);
      }
    };

    checkTokenExpiration();
  }, []);

  return (
    <ApolloProvider
      client={client}
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header isAuthenticated={isAuthenticated} />
      <main>
        <Outlet />
      </main>
    </ApolloProvider>
  );
}

export default App;
