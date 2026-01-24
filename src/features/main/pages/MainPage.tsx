import UseLogoutMutation from "@/features/auth/model/useLogoutMutation";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();
  const logoutMutation = UseLogoutMutation();

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
      {/* 임시로 logout 버튼 넣어둔 것 */}
      <button onClick={onLogout}>로그아웃</button>
    </div>
  );
}
