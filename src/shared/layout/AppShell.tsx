import { Outlet } from "react-router-dom";
import Header from "../ui/Header";
import { tokenStorage } from "../auth/tokenStorage";
import useGetProfile from "@/features/timer/model/useGetProfile";

type Props = {
  name: string;
  avatarUrl: string;
};

export default function AppShell() {
  const hasToken = !!tokenStorage.getAccessToken();
  const { data } = useGetProfile();

  const user: Props | undefined =
    hasToken && data
      ? { name: data.nickname, avatarUrl: data.profile?.profileImage }
      : undefined;
  return (
    <div
      className="min-h-screen
    bg-gradient-to-b
    from-[#F6F7F9]
    to-[#E9ECF5]"
    >
      <Header user={user} />
      <Outlet />
    </div>
  );
}
