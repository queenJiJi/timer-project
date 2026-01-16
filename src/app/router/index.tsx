import { createBrowserRouter } from "react-router-dom";
import SignupPage from "@/features/auth/pages/SignupPage";

export const router = createBrowserRouter([
  { path: "/auth/signup", element: <SignupPage /> },
]);
