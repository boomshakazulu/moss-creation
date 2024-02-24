import { Outlet } from "react-router-dom";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import "./App.css";

function App() {
  return (
    <main>
      <Outlet />
    </main>
  );
}

export default App;
