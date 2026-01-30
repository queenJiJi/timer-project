import { Outlet } from "react-router-dom";
import Header from "../ui/Header";
import useGetProfile from "@/features/profile/model/useGetProfile";
import { useAuthStore } from "../auth/authStore";
import useTimerTicker from "@/features/timer/model/useTimerTicker";

export default function AppShell() {
  useTimerTicker(); // 앱전체에서 타이머 진행

  const isAuthed = useAuthStore((s) => s.isAuthed);
  const { data } = useGetProfile();

  const user =
    isAuthed && data
      ? { name: data.nickname, avatarUrl: data.profile?.profileImage }
      : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F7F9] to-[#E9ECF5]">
      <Header user={user} />
      <Outlet />
    </div>
  );
}
