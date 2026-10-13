import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthProvider from "./components/AuthProvider";
import AuroraBackground from "./components/AuroraBackground";
import "@fontsource-variable/inter";
import "@fontsource/playfair-display/cyrillic-400-italic.css";
import "@fontsource/playfair-display/latin-400-italic.css";
import "./index.css";

// Application entry point.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AuroraBackground />
        <div className="app-content">
          <App />
        </div>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
