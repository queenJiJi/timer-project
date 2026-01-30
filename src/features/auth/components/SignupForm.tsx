import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, FormField, Input } from "@/shared/ui";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import TermsBox from "./TermsBox";
import {
  useCheckEmailQuery,
  useCheckNicknameQuery,
} from "../model/useDupChecks";
import { useSignupMutation } from "../model/useSignupMutation";

const schema = z
  .object({
    id: z.string().email("이메일 형식으로 작성해 주세요."),
    nickname: z.string().min(1, "닉네임을 입력해 주세요."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상, 영문과 숫자 조합이어야 합니다."),
    passwordConfirm: z.string().min(8, "비밀번호가 일치하지 않습니다."),
    agree: z.boolean().refine((v) => v === true),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type Inputs = z.infer<typeof schema>;
type CheckStatus = "default" | "available" | "unavailable";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors, isValid, isSubmitting },
    getValues,
    setError,
    clearErrors,
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      id: "",
      nickname: "",
      password: "",
      passwordConfirm: "",
      agree: false,
    },
  });
  const navigate = useNavigate();

  const [idStatus, setIdStatus] = useState<CheckStatus>("default");
  const [nicknameStatus, setNicknameStatus] = useState<CheckStatus>("default");
  const [idChecked, setIdChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);

  const idVal = useWatch({ control, name: "id" });
  const canCheckId = Boolean(idVal) && !errors.id && !idChecked;

  const nicknameVal = useWatch({ control, name: "nickname" });
  const canCheckNickname =
    Boolean(nicknameVal) && !errors.nickname && !nicknameChecked;

  // 중복확인 쿼리
  const emailQuery = useCheckEmailQuery(idVal ?? "");
  const nicknameQuery = useCheckNicknameQuery(nicknameVal ?? "");

  // 회원가입 mutation
  const signupMutation = useSignupMutation();

  const canSubmit =
    isValid &&
    getValues("agree") === true &&
    idChecked &&
    nicknameChecked &&
    !isSubmitting;

  //  입력값이 바뀌면 중복확인 무효화: useEffect 대신 register onChange로 처리
  const idRegister = register("id", {
    onChange: () => {
      // 입력이 바뀌면 "중복확인 결과" 초기화
      if (idChecked) setIdChecked(false);
      if (idStatus !== "default") setIdStatus("default");
    },
  });

  const nicknameRegister = register("nickname", {
    onChange: () => {
      if (nicknameChecked) setNicknameChecked(false);
      if (nicknameStatus !== "default") setNicknameStatus("default");
    },
  });

  // 중복확인 상태 초기화
  const resetDup = () => {
    setIdChecked(false);
    setIdStatus("default");
    setNicknameChecked(false);
    setNicknameStatus("default");
  };

  // 아이디 중복확인
  const handleCheckId = async () => {
    const email = getValues("id");
    if (!email || errors.id) return;
    clearErrors("id");

    try {
      const res = await emailQuery.refetch(); // 버튼 클릭 시 수동으로 쿼리 실행
      const data = res.data;

      if (!data) return;
      if (data.available) {
        setIdStatus("available");
        setIdChecked(true);
      } else {
        setIdStatus("unavailable");
        setIdChecked(false);
        setError("id", {
          type: "manual",
          message: "이미 사용 중인 이메일입니다.",
        });
      }
    } catch (e) {
      setIdStatus("unavailable");
      setIdChecked(false);
      setError("id", {
        type: "manual",
        message: e instanceof Error ? e.message : "이메일 중복확인 실패",
      });
    }
  };

  // 닉네임 중복확인
  const handleCheckNickname = async () => {
    const getNickname = getValues("nickname");
    if (!getNickname || errors.nickname) return;

    clearErrors("nickname");

    try {
      const res = await nicknameQuery.refetch();
      const data = res.data;

      if (!data) return;
      if (data.available) {
        setNicknameStatus("available");
        setNicknameChecked(true);
      } else {
        setNicknameStatus("unavailable");
        setNicknameChecked(false);
        setError("nickname", {
          type: "manual",
          message: "이미 사용 중인 닉네임입니다.",
        });
      }
    } catch (e) {
      setNicknameStatus("unavailable");
      setNicknameChecked(false);
      setError("nickname", {
        type: "manual",
        message: e instanceof Error ? e.message : "닉네임 중복확인 실패",
      });
    }
  };

  // 회원가입 제출
  const onSubmit: SubmitHandler<Inputs> = async (form) => {
    if (!idChecked) {
      setError("id", { type: "manual", message: "중복을 확인해 주세요." });
      return;
    }
    if (!nicknameChecked) {
      setError("nickname", {
        type: "manual",
        message: "중복을 확인해 주세요.",
      });
      return;
    }

    try {
      const data = {
        email: form.id,
        nickname: form.nickname,
        password: form.password,
        confirmPassword: form.passwordConfirm,
      };

      await signupMutation.mutateAsync(data);

      reset();
      resetDup();

      navigate("/auth/login", { replace: true }); // 로그인 페이지로 이동
    } catch (e) {
      console.error("회원가입 실패:", e);
    }
  };

  // 회원가입 시도
  const handleSignupAttempt = async () => {
    const ok = await trigger(
      ["id", "nickname", "password", "passwordConfirm", "agree"],
      { shouldFocus: true },
    );
    if (ok) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <section className="bg-white p-10">
      <h1 className="text-center text-mainColor font-bold text-2xl mb-9">
        회원가입
      </h1>

      <form onSubmit={(e) => e.preventDefault()}>
        {/* 아이디 */}
        <FormField
          label="아이디"
          errorText={errors.id?.message}
          successText={
            idStatus === "available" ? "사용 가능한 이메일입니다." : ""
          }
          className="mb-10"
        >
          <div className="flex">
            <div className="flex-1 mr-3">
              <Input
                type="email"
                placeholder="이메일 주소 형식으로 입력해 주세요."
                {...idRegister}
                error={errors.id?.message}
              />
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="w-[84px] h-[44px] shrink-0"
              disabled={!canCheckId}
              onClick={handleCheckId}
            >
              중복 확인
            </Button>
          </div>
        </FormField>

        {/* 닉네임 */}
        <FormField
          label="닉네임"
          errorText={errors.nickname?.message}
          successText={
            nicknameStatus === "available" ? "사용 가능한 닉네임입니다." : ""
          }
          className="mb-10"
        >
          <div className="flex">
            <div className="flex-1 mr-3">
              <Input
                type="text"
                placeholder="닉네임을 입력해 주세요."
                {...nicknameRegister}
                error={errors.nickname?.message}
              />
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="w-[84px] h-[44px] shrink-0"
              disabled={!canCheckNickname}
              onClick={handleCheckNickname}
            >
              중복 확인
            </Button>
          </div>
        </FormField>

        {/* 비밀번호 */}
        <FormField
          label="비밀번호"
          errorText={errors.password?.message}
          className="mb-10"
        >
          <Input
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            {...register("password")}
            error={errors.password?.message}
          />
        </FormField>

        {/* 비밀번호 확인 */}
        <FormField
          label="비밀번호 확인"
          errorText={errors.passwordConfirm?.message}
          className="mb-10"
        >
          <Input
            type="password"
            placeholder="비밀번호를 다시 입력해 주세요."
            {...register("passwordConfirm")}
            error={errors.passwordConfirm?.message}
          />
        </FormField>

        {/* 이용약관 */}
        <div className="grid gap-2 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">이용약관</p>
            <Controller
              name="agree"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label="동의함"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  error={!!errors.agree}
                />
              )}
            />
          </div>
          <TermsBox />
        </div>

        {/* 회원가입 버튼 */}
        <Button
          type="button"
          size="lg"
          className="mt-2 w-full mb-6 text-[18px] font-semibold"
          onClick={handleSignupAttempt}
          disabled={isSubmitting}
          aria-disabled={!canSubmit}
        >
          회원가입
        </Button>

        {/* 하단링크 */}
        <div className="text-center text-sm text-mainColor">
          <span className="mr-3">회원이신가요?</span>
          <Link className="font-bold" to="/auth/login">
            로그인 바로가기
          </Link>
        </div>
      </form>
    </section>
  );
}
