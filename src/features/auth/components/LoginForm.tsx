import logo from "@/assets/logo.svg";
import { tokenStorage } from "@/shared/auth/tokenStorage";
import { Button, FormField, Input } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";
import { useLoginMutations } from "../model/useLoginMutation";
import { useRef } from "react";

export default function LoginForm() {
  const schema = z.object({
    id: z
      .string()
      .min(1, "이메일을 입력해 주세요.")
      .email("이메일 형식으로 작성해 주세요."),
    password: z
      .string()
      .min(1, "비밀번호를 입력해 주세요.")
      .min(8, "비밀번호는 8자 이상, 영문과 숫자 조합이어야 합니다."),
  });
  type Inputs = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      id: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const idRegister = register("id");
  const loginMutation = useLoginMutations();
  const canSubmit = isValid && !isSubmitting;

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await loginMutation.mutateAsync({
        email: data.id,
        password: data.password,
      });

      tokenStorage.setTokens({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      });

      if (res.isDuplicateLogin) {
        //TODO: 중복 로그인이 불가하다는 모달 띄우기
        alert("중복 로그인이 불가능합니다.");
      }

      if (res.isFirstLogin) {
        // 최초 로그인 시 프로필 설정 페이지로 이동
        navigate("/profile", { replace: true });
      } else {
        // 메인페이지(타이머페이지)로 이동
        navigate("/", { replace: true });
      }
    } catch (error) {
      //TODO: 에러 모달 띄우기
      alert("로그인 정보를 다시 확인해 주세요");
      console.log(error);
      setTimeout(() => emailRef.current?.focus(), 0);
    }
  };

  const handleLoginAttempt = async () => {
    const ok = await trigger(["id", "password"], { shouldFocus: true });
    if (ok) {
      handleSubmit(onSubmit)();
    }
  };

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
      <form onSubmit={(e) => e.preventDefault()} className="w-full">
        {/* 아이디 */}
        <FormField
          label="아이디"
          errorText={errors.id?.message}
          className="w-full mb-10"
        >
          <Input
            type="email"
            placeholder="이메일 주소를 입력해 주세요."
            {...idRegister}
            ref={(el) => {
              idRegister.ref(el);
              emailRef.current = el;
            }}
            error={errors.id?.message}
          />
        </FormField>

        {/* 비밀번호 */}
        <FormField
          label="비밀번호"
          errorText={errors.password?.message}
          className="w-full mb-10"
        >
          <Input
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            {...register("password")}
            error={errors.password?.message}
          />
        </FormField>
        {/* 로그인 버튼 */}
        <Button
          type="button"
          size="lg"
          className="mt-2 w-full mb-6 text-[18px] font-semibold"
          onClick={handleLoginAttempt}
          aria-disabled={!canSubmit}
          disabled={isSubmitting}
        >
          로그인
        </Button>

        {/* 하단링크 */}
        <div className="text-center text-sm text-mainColor">
          <Link to="/auth/signup">회원가입</Link>
        </div>
      </form>
    </section>
  );
}
