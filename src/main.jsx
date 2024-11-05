import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { PopupProvider } from "./contexts/PopupContext";
import { LoadingProvider } from "./contexts/LoadingContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PopupProvider>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </PopupProvider>
  </StrictMode>
);
