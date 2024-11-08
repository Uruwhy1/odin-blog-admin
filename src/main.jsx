import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { PopupProvider } from "./contexts/PopupContext";
import { LoadingProvider } from "./contexts/LoadingContext.jsx";
import { ModeProvider } from "./contexts/PageModeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ModeProvider>
      <PopupProvider>
        <LoadingProvider>
          <App />
        </LoadingProvider>
      </PopupProvider>
    </ModeProvider>
  </StrictMode>
);
