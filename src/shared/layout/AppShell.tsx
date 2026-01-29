import { Outlet } from "react-router-dom";
import Header from "../ui/Header";

export default function AppShell() {
  return (
    <div
      className="min-h-screen
    bg-gradient-to-b
    from-[#F6F7F9]
    to-[#E9ECF5]"
    >
      <Header />
      <Outlet />
    </div>
  );
}
