import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="min-h-screen h-screen w-screen flex flex-col md:flex-row bg-gradient-to-br from-primary via-accent to-pink-200">
      <App />
    </main>
  </StrictMode>
);
