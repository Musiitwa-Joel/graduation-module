import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./auth/AuthContext.tsx";
import ApolloSetup from "./ApolloSetup.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ApolloSetup>
        <Router>
          <Routes>
            <Route path="*" element={<App />} />
          </Routes>
        </Router>
      </ApolloSetup>
    </AuthProvider>
  </StrictMode>
);
