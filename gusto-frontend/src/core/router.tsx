import { createBrowserRouter, Navigate } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ProtectedRoute from "../components/ProtectedRoute";
import UserManagement from "../pages/UserManagement";
import MainLayout from "../components/Layout/MainLayout";
import AuthLayout from "../components/Layout/AuthLayout";

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { index: true, element: <Navigate to="/welcome" replace /> },
          { path: "welcome", element: <Welcome /> },
          { path: "login", element: <Login /> },
          { path: "signup", element: <Signup /> },
          { path: "register", element: <Register /> },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { path: "home", element: <Home /> },
              { path: "profile/:username", element: <UserManagement /> },
              // future pages
              // { path: "recipes/:id", element: <Recipe /> },
              // { path: "settings", element: <Settings /> },
            ],
          },
        ],
      },

      // before
      // {
      //   element: <MainLayout />,
      //   children: [
      //     { path: "home", element: <Home /> },
      //     { path: "profile/:username", element: <UserManagement /> },

      //     // future pages
      //     // { path: "recipes/:id", element: <Recipe /> },
      //     // { path: "settings", element: <Settings /> },
      //   ],
      // },
    ],
  },
]);

export default router;
