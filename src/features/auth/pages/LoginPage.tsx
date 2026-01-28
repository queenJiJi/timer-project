import logo_huge from "@/assets/logo_huge.png";
import LoginForm from "../components/LoginForm";
export default function LoginPage() {
  return (
    <section className="relative min-h-screen w-full bg-white overflow-hidden">
      <img
        src={logo_huge}
        alt="Devtime Symbol Logo"
        draggable="false"
        className="
            pointer-events-none absolute
            right-0 top-[60px]
            w-[1090px] h-[530px]
            max-w-none"
      />
      <main className="relative z-10 grid min-h-screen place-items-center ">
        <LoginForm />
      </main>
    </section>
  );
}
