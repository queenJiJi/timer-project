import { createBrowserRouter } from "react-router-dom";
import SignupPage from "@/features/auth/pages/SignupPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import ProtectedRoute from "@/shared/auth/ProtectedRoute";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import TimerPage from "@/features/timer/pages/TimerPage";
// import LandingPage from "@/features/main/pages/LandingPage";
import AuthShell from "@/shared/layout/AuthShell";
import AppShell from "@/shared/layout/AppShell";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import RankingPage from "@/features/ranking/pages/RankingPage";

export const router = createBrowserRouter([
  // 앱 레이아웃(배경+헤터 기본적용)
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <TimerPage /> }, // 랜딩페이지(공개)

      {
        // 프로필 설정 페이지는 로그인 필요
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        // 대시보드 페이지는 로그인 필요
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        // 랭킹 페이지는 로그인 필요
        path: "/ranking",
        element: (
          <ProtectedRoute>
            <RankingPage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // 인증 레이아웃(배경/헤더 없음)
  {
    element: <AuthShell />,
    children: [
      { path: "/auth/signup", element: <SignupPage /> },
      { path: "/auth/login", element: <LoginPage /> },
    ],
  },
]);
