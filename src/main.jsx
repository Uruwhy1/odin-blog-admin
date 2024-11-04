import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { PopupProvider } from "./contexts/PopupContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PopupProvider>
      <App />
    </PopupProvider>
  </StrictMode>
);
