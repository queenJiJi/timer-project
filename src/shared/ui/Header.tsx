import { Link, NavLink } from "react-router-dom";
import logo_horizontal from "@/assets/logo_horizontal.png";

import useLogout from "@/features/auth/model/useLogout";

type Props = {
  user?: { name: string; avatarUrl?: string };
};
export default function Header({ user }: Props) {
  const { onLogout } = useLogout();

  return (
    <header className="w-full">
      <div className="mx-auto flex h-[72px] w-full max-w-[1200px] items-center justify-between px-10">
        {/* 왼쪽 영역 */}
        <div className="flex items-center gap-10">
          {/*  DevTime 로고를 클릭하면 타이머 페이지로 이동 */}
          <Link to="/">
            <img src={logo_horizontal} alt="DevTime" />
          </Link>
          <nav className="flex items-center gap-9 text-[16px] text-secondColor">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "font-semibold underline underline-offset-4"
                  : "hover:font-semibold"
              }
            >
              대시보드
            </NavLink>
            <NavLink
              to="/ranking"
              className={({ isActive }) =>
                isActive
                  ? "font-semibold underline underline-offset-4"
                  : "hover:font-semibold"
              }
            >
              랭킹
            </NavLink>
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
