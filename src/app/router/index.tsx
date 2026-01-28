import { createBrowserRouter } from "react-router-dom";
import SignupPage from "@/features/auth/pages/SignupPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import ProtectedRoute from "@/shared/auth/ProtectedRoute";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import TimerPage from "@/features/timer/pages/TimerPage";
import LandingPage from "@/features/main/pages/LandingPage";

export const router = createBrowserRouter([
  // 랜딩페이지(공개)
  { path: "/", element: <LandingPage /> },

  {
    // 메인(타이머)페이지는 로그인 필요
    path: "/timer",
    element: (
      <ProtectedRoute>
        <TimerPage />
      </ProtectedRoute>
    ),
  },
  {
    // 프로필 설정 페이지는 로그인 필요
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
