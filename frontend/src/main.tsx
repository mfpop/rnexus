import React from "react";
import "./lib/consoleFilter";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./app.css";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo";
import { AuthProvider } from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>,
);
