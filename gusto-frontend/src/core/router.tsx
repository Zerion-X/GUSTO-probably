import { createBrowserRouter, Navigate } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import SearchResults from "../pages/SearchResults";
import ProtectedRoute from "../components/ProtectedRoute";
import UserManagement from "../pages/UserManagement";
import MainLayout from "../components/Layout/MainLayout";
import AuthLayout from "../components/Layout/AuthLayout";
import RecipePage from "../pages/RecipePage";
import RecipeCollectionPage from "../pages/RecipeCollectionPage";
import AddPost from "../pages/Post";
import EditPost from "../components/EditPost";

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
        ],
      },
 
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { path: "home", element: <Home /> },
              { path: "search", element: <SearchResults /> },
              {
                path: "profile/favorites",
                element: <RecipeCollectionPage type="favorites" />,
              },
              {
                path: "profile/saved",
                element: <RecipeCollectionPage type="saved" />,
              },
              { path: "profile/:username", element: <UserManagement /> },
              { path: "recipes/:id", element: <RecipePage /> },
              { path: "/createpost", element: <AddPost /> },
              { path: "/:username/:id/edit", element: <EditPost /> },
              // { path: "settings", element: <Settings /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
