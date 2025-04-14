// import "@/styles/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Content from "./content";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Content />
  </StrictMode>
);
