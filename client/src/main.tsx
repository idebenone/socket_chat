import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/providers/theme-provider.tsx";
import { Provider } from "react-redux";

import Login from "./pages/login.tsx";
import Register from "./pages/register.tsx";
import Home from "./pages/home.tsx";
import { store } from "./store/store.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/:user",
    element: <Home />,
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
    <Provider store={store}>
      <div className="p-12 h-full">
        <div className="border rounded-sm p-6 dark:bg-zinc-900 bg-zinc-300 h-full">
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
          </ThemeProvider>
        </div>
      </div>
    </Provider>
  </React.StrictMode>
);
