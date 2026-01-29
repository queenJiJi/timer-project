import { Link, useNavigate } from "react-router-dom";
import logo_horizontal from "@/assets/logo_horizontal.png";
import useLogoutMutation from "@/features/auth/model/useLogoutMutation";

type Props = {
  user?: { name: string; avatarUrl: string };
};
export default function Header({ user }: Props) {
  const logoutMutation = useLogoutMutation();
  const navigate = useNavigate();
  const onLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      navigate("/auth/login", { replace: true });
    }
  };
  return (
    <header className="w-full">
      <div className="mx-auto flex h-[72px] w-full max-w-[1200px] items-center justify-between px-10">
        {/* 왼쪽 영역 */}
        <div className="flex items-center gap-10">
          <Link to="/">
            <img src={logo_horizontal} alt="DevTime" />
          </Link>
          <nav className="flex items-center gap-9 text-[16px] text-secondColor">
            <Link to="/timer" className="hover:font-semibold after:underline">
              대시보드
            </Link>
            <Link to="/ranking" className="hover:font-semibold after:underline">
              랭킹
            </Link>
          </nav>
        </div>
        {/* 오른쪽 영역 */}
        {!user ? (
          <nav className="flex items-center gap-9 text-[16px] text-secondColor">
            <Link to="/auth/login" className="hover:font-semibold">
              로그인
            </Link>
            <Link to="/auth/signup" className="hover:font-semibold">
              회원가입
            </Link>
          </nav>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 overflow-hidden rounded-full bg-[#D7DEFF]">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={`${user.name} avatar`}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <span className="text-[16px] font-bold text-secondColor">
                {user.name}
              </span>{" "}
              {/* 임시로 logout 버튼 넣어둔 것 */}
              <button onClick={onLogout}>로그아웃</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
