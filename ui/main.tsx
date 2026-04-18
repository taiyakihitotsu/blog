import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "@/App.js";

const root = document.getElementById("root");

if (!root) {
  throw new Error("root is null.");
}

const path = window.location.pathname;

if (import.meta.env.DEV) {
  createRoot(root).render(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );
} else {
  hydrateRoot(root, <App path={path} />);
}
