import SplitLayout from "../components/SplitLayout";
import SignupForm from "../components/SignupForm";
import BrandPanel from "../components/BrandPanel";

export default function SignupPage() {
  return (
    <SplitLayout left={<BrandPanel />}>
      <SignupForm />
    </SplitLayout>
  );
}
