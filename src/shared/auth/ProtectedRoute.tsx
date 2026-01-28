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
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  return children;
}
