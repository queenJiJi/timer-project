import useLogoutMutation from "@/features/auth/model/useLogoutMutation";
import { useNavigate } from "react-router-dom";

export default function TimerPage() {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  const onLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <div>
      <h1>여기가 메인(타이머)페이지에요</h1>
    </div>
  );
}
