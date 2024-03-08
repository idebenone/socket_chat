import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./store/store.ts";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import { ThemeProvider } from "./components/providers/theme-provider.tsx";
import { Toaster } from "@/components/ui/toaster";

import Login from "./pages/login.tsx";
import Register from "./pages/register.tsx";
import Home from "./pages/home.tsx";
import Error from "./pages/error.tsx";
import { SocketProvider } from "./components/providers/socket-provider.tsx";
import OnBoarding from "./pages/onboarding.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
    children: [
      {
        path: "/:id",
        element: <Home />,
      },
    ],
  },
  {
    path: "/user/onboarding",
    element: <OnBoarding />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SocketProvider>
          <RouterProvider router={router} />
          <Toaster />
        </SocketProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
