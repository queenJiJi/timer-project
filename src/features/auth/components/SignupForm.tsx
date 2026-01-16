import { Button, FormField, Input } from "@/shared/ui";

export default function SignupForm() {
  return (
    <section className="bg-white p-10">
      <h1 className="text-center text-mainColor font-bold text-2xl mb-9">
        회원가입
      </h1>

      <form>
        {/* 아이디 */}
        <FormField
          label="이메일 주소"
          errorText={"이메일 형식으로 작성해 주세요."}
        >
          {/* TODO: DoubleCheck Input 컴포넌트 만들고 추가 */}
          <Input
            type="email"
            error="error"
            rightSlot={
              <Button size="sm" className="bg-mainColor/10 text-mainColor">
                중복 확인
              </Button>
            }
          />
        </FormField>

        {/* 닉네임 */}
        <FormField label="닉네임" errorText={"닉네임을 입력해 주세요."}>
          {/* TODO: DoubleCheck Input 컴포넌트 만들고 추가 */}
          <Input
            type="text"
            error="error"
            rightSlot={
              <Button size="sm" className="bg-mainColor/10 text-mainColor">
                중복 확인
              </Button>
            }
          />
        </FormField>

        {/* 비밀번호 */}
        <FormField
          label="비밀번호"
          errorText={"비밀번호는 8자 이상, 영문과 숫자 조합이어야 합니다."}
        >
          {/* TODO: DoubleCheck Input 컴포넌트 만들고 추가 */}
          <Input type="password" error="error" />
        </FormField>

        {/* 비밀번호 확인 */}
        <FormField
          label="비밀번호 확인"
          errorText={"비밀번호가 일치하지 않습니다."}
        >
          {/* TODO: DoubleCheck Input 컴포넌트 만들고 추가 */}
          <Input type="password" error="error" />
        </FormField>

        {/* 이용약관 */}

        {/* 회원가입 버튼 */}
        <Button size="lg" className="mt-2 w-full">
          회원가입
        </Button>

        {/* 하단링크 */}
        <div>
          <span>회원이신가요?</span> <a>로그인 바로가기</a>
        </div>
      </form>
    </section>
  );
}
