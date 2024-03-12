import { Outlet } from "react-router-dom";
import { useState } from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import "./App.css";

import Header from "./components/header";

function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
