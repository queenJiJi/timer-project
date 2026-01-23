import { createBrowserRouter } from "react-router-dom";
import SignupPage from "@/features/auth/pages/SignupPage";
import MainPage from "@/features/main/pages/MainPage";
import LoginPage from "@/features/auth/pages/LoginPage";

export const router = createBrowserRouter([
  { path: "/", element: <MainPage /> },
  { path: "/auth/signup", element: <SignupPage /> },
  { path: "/auth/login", element: <LoginPage /> },
]);
