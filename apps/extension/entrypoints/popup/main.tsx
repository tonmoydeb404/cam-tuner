import "@workspace/ui/globals.css"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./app.tsx"

const applyTheme = (dark: boolean) => {
  document.documentElement.classList.toggle("dark", dark)
}

const mq = window.matchMedia("(prefers-color-scheme: dark)")
applyTheme(mq.matches)
mq.addEventListener("change", (e) => applyTheme(e.matches))

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
