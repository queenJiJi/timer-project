import SplitLayout from "../components/SplitLayout";
import SignupForm from "../components/SignupForm";
import logo from "@/assets/logo_white.svg";

function BrandPanel() {
  return (
    <div className="text-white flex flex-col items-center justify-center gap-4">
      <img src={logo} alt="DevTime Logo" className="w-[264px] h-[200px]" />
      <p className="text-[20px] opacity-90">개발자를 위한 타이머</p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <SplitLayout left={<BrandPanel />}>
      <SignupForm />
    </SplitLayout>
  );
}
