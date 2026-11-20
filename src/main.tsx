import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import DevToolsGuard from "./security/DevToolsGuard";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DevToolsGuard>
        <AuthProvider>
          <App />
        </AuthProvider>
      </DevToolsGuard>
    </BrowserRouter>
  </React.StrictMode>
);
