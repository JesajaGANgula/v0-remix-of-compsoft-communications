import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./index.css"

function mountApp() {
  const rootElement = document.getElementById("root")

  if (!rootElement) {
    console.error('Root element not found. Make sure there is a div with id="root" in your HTML.')
    return
  }

  try {
    const root = createRoot(rootElement)
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  } catch (error) {
    console.error("Failed to mount React app:", error)
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountApp)
} else {
  mountApp()
}
