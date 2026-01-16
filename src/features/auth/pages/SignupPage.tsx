import SplitLayout from "../components/SplitLayout";
import SignupForm from "../components/SignupForm";

function BrandPanel() {
  return (
    <div className="text-white flex flex-col items-center justify-center gap-4">
      {/* 로고 이미지가 있으면 <img />로 교체 */}
      <div className="text-4xl font-extrabold tracking-tight">DevTime</div>
      <p className="text-sm opacity-90">개발자를 위한 타이머</p>
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
