import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { StoreProvider } from "./utils/GlobalState";
import { setContext } from "@apollo/client/link/context";
import "./App.css";

import Footer from "./components/footer";
import Header from "./components/header";
import Auth from "./utils/auth";

const httpLink = createHttpLink({
  uri: "https://mossycreations-e28ddb580b4a.herokuapp.com/graphql",
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
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 992);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 992);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      <StoreProvider>
        <Header isAuthenticated={isAuthenticated} />
        <main>
          <Outlet />
        </main>
        {isLargeScreen && <Footer />}
      </StoreProvider>
    </ApolloProvider>
  );
}

export default App;
