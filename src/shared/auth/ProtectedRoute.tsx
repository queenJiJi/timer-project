import { Navigate, useLocation } from "react-router-dom";
import { tokenStorage } from "./tokenStorage";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const access = tokenStorage.getAccess();

  if (!access) {
    // 로그인이 안된상태라면 로그인페이지로 이동 (로그인되었다면 원래 있던 장소로 다시 이동됨)
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  return children;
}
