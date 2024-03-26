import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import $ from "jquery";
window.jQuery = $;

import Home from "./pages/home";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import AdminAdd from "./pages/adminAdd.jsx";
import Admin from "./pages/admin.jsx";
import AdminUpdate from "./pages/adminUpdate.jsx";
import Item from "./pages/product.jsx";
import Error from "./pages/Error.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/item/:itemId",
        element: <Item />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/admin/add",
        element: <AdminAdd />,
      },
      {
        path: "/admin/:itemId",
        element: <AdminUpdate />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
