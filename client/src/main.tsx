import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Chat from "./pages/chat.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

const router = createBrowserRouter([
  {
    path: "/",
    element: <App socket={socket} />,
  },
  {
    path: "/chat/:username",
    element: <Chat socket={socket} />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
