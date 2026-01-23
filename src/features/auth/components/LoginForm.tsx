import logo from "@/assets/logo.svg";
import { Button, FormField, Input } from "@/shared/ui";
import { Link } from "react-router-dom";
export default function LoginForm() {
  return (
    <section
      className=" w-full max-w-[500px] h-[598px] px-[86px]
        rounded-[10px]
        bg-white/50
        backdrop-blur-[50px]
        shadow-[0_40px_100px_40px_rgba(3,104,255,0.05)]
        flex flex-col items-center justify-center"
    >
      <img
        src={logo}
        alt="Devtime Logo"
        className="mb-12 w-[132px] h-[100px]"
      />
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      {/* 아이디 */}
      <FormField
        label="아이디"
        //   errorText={errors.password?.message}
        className="w-full mb-10"
      >
        <Input
          type="password"
          placeholder="이메일 주소를 입력해 주세요."
          // {...register("password")}
          // error={errors.password?.message}
        />
      </FormField>

      {/* 비밀번호 */}
      <FormField
        label="비밀번호"
        //   errorText={errors.passwordConfirm?.message}
        className="w-full mb-10"
      >
        <Input
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          // {...register("passwordConfirm")}
          // error={errors.passwordConfirm?.message}
        />
      </FormField>
      {/* 로그인 버튼 */}
      <Button
        type="submit"
        size="lg"
        className="mt-2 w-full mb-6 text-[18px] font-semibold"
        //   disabled={!canSubmit}
      >
        로그인
      </Button>

      {/* 하단링크 */}
      <div className="text-center text-sm text-mainColor">
        <Link to="/auth/signup">회원가입</Link>
      </div>
      {/* </form> */}
    </section>
  );
}
