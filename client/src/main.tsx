import React from "react";
import ReactDOM from "react-dom/client";
import io from "socket.io-client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/providers/theme-provider.tsx";

import App from "./App.tsx";
import Chat from "./pages/chat.tsx";
import Login from "./pages/login.tsx";
import Register from "./pages/register.tsx";

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
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
