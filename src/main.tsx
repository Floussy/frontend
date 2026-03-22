import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import "./index.css";
import App from "./App";
import { isRTL } from "./i18n";
import i18n from "./i18n";

// Set initial direction based on saved language
const lang = i18n.language ?? "fr";
document.documentElement.dir = isRTL(lang) ? "rtl" : "ltr";
document.documentElement.lang = lang;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
