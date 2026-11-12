import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import Providers from "./app/providers.tsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router}/>
      <App />
    </Providers>
  </StrictMode>,
);
