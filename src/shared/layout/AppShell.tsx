import { Outlet } from "react-router-dom";
import Header from "../ui/Header";
import useGetProfile from "@/features/profile/model/useGetProfile";

export default function AppShell() {
  // const hasToken = !!tokenStorage.getAccessToken();
  const { data } = useGetProfile();

  const user = data
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
