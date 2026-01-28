import { createBrowserRouter } from "react-router-dom";
import SignupPage from "@/features/auth/pages/SignupPage";
import MainPage from "@/features/main/pages/MainPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import ProtectedRoute from "@/shared/auth/ProtectedRoute";
import ProfilePage from "@/features/profile/pages/ProfilePage";

export const router = createBrowserRouter([
  // 메인(타이머)페이지는 로그인 필요
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    ),
  },
  // 프로필 설정 페이지는 로그인 필요
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },

  { path: "/auth/signup", element: <SignupPage /> },
  { path: "/auth/login", element: <LoginPage /> },
]);
