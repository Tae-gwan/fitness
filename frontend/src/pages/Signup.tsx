import { Link } from "react-router-dom";
import { User, Lock, UserCircle, ArrowRight, CheckCircle2, ShieldQuestion, KeyRound, Mail } from "lucide-react";

import AuthInput from "@/components/ui/AuthInput";
import AuthButton from "@/components/ui/AuthButton";
import { useSignupForm } from "@/hooks/useSignupForm";

export default function Signup() {
  const { form, status, actions } = useSignupForm();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">회원가입</h2>
          <p className="mt-2 text-sm text-zinc-400 font-medium">
            체계적인 피트니스 관리를 시작하세요.
          </p>
        </div>

        <form className="space-y-6" onSubmit={form.handleSubmit}>
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <AuthInput
                  label="아이디"
                  icon={User}
                  name="username"
                  type="text"
                  required
                  placeholder="아이디 입력"
                  value={form.data.username}
                  onChange={form.handleChange}
                  error={form.errors.username}
                  success={form.success.username}
                />
              </div>
              <button
                type="button"
                onClick={actions.checkIdDuplicate}
                disabled={status.isIdChecking || !form.data.username}
                className={`h-[52px] px-4 rounded-xl text-sm font-bold transition-all whitespace-nowrap mb-[2px] ${
                  status.isIdChecking || !form.data.username
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-zinc-800 text-white hover:bg-zinc-700 active:scale-95"
                }`}
              >
                {status.isIdChecking ? "확인 중..." : "중복확인"}
              </button>
            </div>

            <AuthInput
              label="이메일"
              icon={Mail}
              name="email"
              type="email"
              required
              placeholder="example@mail.com"
              value={form.data.email}
              onChange={form.handleChange}
              error={form.errors.email}
              success={form.success.email}
            />

            <AuthInput
              label="이름"
              icon={UserCircle}
              name="ownerName"
              type="text"
              required
              placeholder="이름을 입력해주세요"
              value={form.data.ownerName}
              onChange={form.handleChange}
              error={form.errors.ownerName}
            />
          </div>

          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <AuthInput
                label="비밀번호"
                icon={Lock}
                name="password"
                type="password"
                required
                placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                value={form.data.password}
                onChange={form.handleChange}
                error={form.errors.password}
                success={form.success.password}
              />
              <AuthInput
                label="비밀번호 확인"
                icon={CheckCircle2}
                name="confirmPassword"
                type="password"
                required
                placeholder="재입력"
                value={form.data.confirmPassword}
                onChange={form.handleChange}
                error={form.errors.confirmPassword}
                success={
                  form.data.password && form.data.confirmPassword && form.data.password === form.data.confirmPassword
                    ? "비밀번호가 일치합니다"
                    : undefined
                }
              />
            </div>
          </div>

          {/* Security Question Section */}
          <div className="space-y-4 pt-4 border-t border-zinc-800/50 mt-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-zinc-300">
                아이디/비밀번호 찾기 질문
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ShieldQuestion className="h-5 w-5 text-zinc-500" />
                </div>
                <select
                  name="securityQuestionId"
                  value={form.data.securityQuestionId}
                  onChange={form.handleChange}
                  className="w-full bg-black border border-zinc-800 rounded-xl py-3.5 pl-11 pr-4 text-sm font-medium outline-none focus:border-neon-500 transition-all text-white appearance-none"
                >
                  <option value="1">출신 초등학교는 어디인가요?</option>
                  <option value="2">태어난 동네는 어디인가요?</option>
                  <option value="3">가장 좋아하는 동물은 무엇인가요?</option>
                  <option value="4">반려동물의 이름은 무엇인가요?</option>
                  <option value="5">나의 어릴 적 별명은 무엇인가요?</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-zinc-500 text-xs">
                  ▼
                </div>
              </div>
            </div>

            <AuthInput
              label="질문 답변"
              icon={KeyRound}
              name="securityAnswer"
              type="text"
              required
              placeholder="답변을 입력해주세요"
              value={form.data.securityAnswer}
              onChange={form.handleChange}
              error={form.errors.securityAnswer}
            />
          </div>

          <div className="pt-2">
            <AuthButton type="submit" isLoading={status.isLoading} icon={ArrowRight}>
              회원가입하기
            </AuthButton>
          </div>
        </form>

        <div className="mt-8 text-center text-sm font-medium">
          <p className="text-zinc-400">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="text-neon-500 hover:text-neon-400 font-bold ml-1 transition-colors underline underline-offset-4">
              로그인하기
            </Link>
          </p>
        </div>

        <p className="mt-10 text-center text-[10px] text-zinc-600 leading-relaxed px-4">
          가입 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
