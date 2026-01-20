import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Checkbox, FormField, Input } from "@/shared/ui";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import TermsBox from "./TermsBox";

export default function SignupForm() {
  const schema = z
    .object({
      id: z.string().email("이메일 주소 형식으로 입력해 주세요."),
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
  type CheckStatus = "default" | "checking" | "available" | "unavailable";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
    setError,
    clearErrors,
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

  const idVal = useWatch({ control, name: "id" });
  const nicknameVal = useWatch({ control, name: "nickname" });
  const agreeVal = useWatch({ control, name: "agree" });

  const [idStatus, setIdStatus] = useState<CheckStatus>("default");
  const [nicknameStatus, setNicknameStatus] = useState<CheckStatus>("default");
  const [idChecked, setIdChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);

  const canCheckId = Boolean(idVal) && !errors.id && !idChecked;
  const canCheckNickname =
    Boolean(nicknameVal) && !errors.nickname && !nicknameChecked;

  const canSubmit =
    isValid &&
    agreeVal === true &&
    idChecked &&
    nicknameChecked &&
    !isSubmitting;

  // 아이디 입력값이 바뀌면 중복확인 상태 초기화
  useEffect(() => {
    setIdStatus("default");
    setIdChecked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idVal]);

  // 닉네임 입력값이 바뀌면 중복확인 상태 초기화
  useEffect(() => {
    setNicknameStatus("default");
    setNicknameChecked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nicknameVal]);

  // TODO: 실제 아이디 중복확인 API 연동
  const handleCheckId = async () => {
    if (!idVal || errors.id) return;
    clearErrors("id");

    await new Promise((resolve) => setTimeout(resolve, 600));

    const response = !idVal.includes("taken");
    if (response) {
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
  };
  // TODO: 실제 닉네임 중복확인 API 연동
  const handleCheckNickname = async () => {
    if (!nicknameVal || errors.nickname) return;

    clearErrors("nickname");

    await new Promise((r) => setTimeout(r, 600));

    const available = nicknameVal !== "admin"; // 데모
    if (available) {
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
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
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
    console.log("회원가입 데이터:", data);
  };

  return (
    <section className="bg-white p-10">
      <h1 className="text-center text-mainColor font-bold text-2xl mb-9">
        회원가입
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 아이디 */}
        <FormField
          label="아이디"
          errorText={errors.id?.message}
          className="mb-10"
        >
          <div className="flex">
            <div className="flex-1 mr-3">
              <Input
                type="email"
                placeholder="이메일 주소 형식으로 입력해 주세요."
                {...register("id")}
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
          className="mb-10"
        >
          <div className="flex">
            <div className="flex-1 mr-3">
              <Input
                type="text"
                placeholder="닉네임을 입력해 주세요."
                {...register("nickname")}
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
          type="submit"
          size="lg"
          className="mt-2 w-full mb-6 text-[18px] font-semibold"
          disabled={!canSubmit}
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
