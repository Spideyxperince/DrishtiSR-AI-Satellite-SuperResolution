import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {" "}
    <BrowserRouter>
      {" "}
      <App />{" "}
    </BrowserRouter>{" "}
  </StrictMode>,
);
