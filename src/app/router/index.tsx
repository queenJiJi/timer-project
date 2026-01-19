import { createBrowserRouter } from "react-router-dom";
import SignupPage from "@/features/auth/pages/SignupPage";
import MainPage from "@/features/main/pages/MainPage";

export const router = createBrowserRouter([
  { path: "/", element: <MainPage /> },
  { path: "/auth/signup", element: <SignupPage /> },
]);
