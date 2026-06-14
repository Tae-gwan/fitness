import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Mail, Lock, CheckCircle2, ArrowRight, ShieldQuestion, KeyRound, User } from "lucide-react";

import AuthInput from "@/components/ui/AuthInput";
import AuthButton from "@/components/ui/AuthButton";
import { findId, verifyResetAuth, resetPassword } from "@/services/authService";

const SECURITY_QUESTIONS: Record<number, string> = {
  1: "출신 초등학교는 어디인가요?",
  2: "태어난 동네는 어디인가요?",
  3: "가장 좋아하는 동물은 무엇인가요?",
  4: "반려동물의 이름은 무엇인가요?",
  5: "나의 어릴 적 별명은 무엇인가요?",
};

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type"); // "find-id" | "reset-pw"
  const isFindId = type === "find-id";
  const pageTitle = isFindId ? "아이디 찾기" : "비밀번호 재설정";

  const [step, setStep] = useState<"form" | "reset-pw" | "success">("form");
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    securityQuestionId: "1",
    securityAnswer: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [foundId, setFoundId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.securityAnswer) return setErrorMsg("답변을 입력해주세요.");

    setIsLoading(true);

    if (isFindId) {
      if (!formData.email) return setErrorMsg("이메일을 입력해주세요.");
      
      const result = await findId({
        email: formData.email,
        questionId: Number(formData.securityQuestionId),
        answer: formData.securityAnswer,
      });

      if (result.ok && result.foundId) {
        setFoundId(result.foundId);
        setStep("success");
      } else {
        setErrorMsg(result.message || "일치하는 회원 정보를 찾을 수 없습니다.");
      }
    } else {
      if (!formData.username) return setErrorMsg("아이디를 입력해주세요.");

      const result = await verifyResetAuth({
        username: formData.username,
        questionId: Number(formData.securityQuestionId),
        answer: formData.securityAnswer,
      });

      if (result.ok) {
        setStep("reset-pw"); // 인증 성공 시 2단계(비밀번호 입력창)로 이동
      } else {
        setErrorMsg(result.message || "일치하는 회원 정보를 찾을 수 없습니다.");
      }
    }

    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.newPassword) return setErrorMsg("새 비밀번호를 입력해주세요.");
    if (formData.newPassword !== formData.confirmPassword) return setErrorMsg("비밀번호가 일치하지 않습니다.");

    setIsLoading(true);

    const result = await resetPassword({
      username: formData.username,
      newPassword: formData.newPassword,
    });

    if (result.ok) {
      setStep("success");
    } else {
      setErrorMsg(result.message || "비밀번호 재설정에 실패했습니다.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === "form" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{pageTitle}</h2>
              <p className="mt-2 text-sm text-zinc-400 font-medium">
                가입 시 등록한 정보를 정확히 입력해 주세요.
              </p>
            </div>

            <form onSubmit={handleNextStep} className="space-y-4">
              {!isFindId ? (
                <AuthInput
                  label="아이디"
                  icon={User}
                  name="username"
                  type="text"
                  required
                  placeholder="아이디 입력"
                  value={formData.username}
                  onChange={handleChange}
                />
              ) : (
                <AuthInput
                  label="이메일"
                  icon={Mail}
                  name="email"
                  type="email"
                  required
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              )}

              {/* Security Question Section */}
              <div className="space-y-2 pt-2">
                <label className="block text-sm font-bold text-zinc-300">
                  아이디/비밀번호 찾기 질문
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldQuestion className="h-5 w-5 text-zinc-500" />
                  </div>
                  <select
                    name="securityQuestionId"
                    value={formData.securityQuestionId}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-800 rounded-xl py-3.5 pl-11 pr-4 text-sm font-medium outline-none focus:border-neon-500 transition-all text-white appearance-none"
                  >
                    {Object.entries(SECURITY_QUESTIONS).map(([id, text]) => (
                      <option key={id} value={id}>{text}</option>
                    ))}
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
                value={formData.securityAnswer}
                onChange={handleChange}
              />

              {errorMsg && (
                <p className="text-sm text-red-500 font-medium text-center bg-red-500/10 py-2 rounded-lg">
                  {errorMsg}
                </p>
              )}

              <div className="pt-4">
                <AuthButton type="submit" isLoading={isLoading} icon={ArrowRight}>
                  {isFindId ? "아이디 찾기" : "다음"}
                </AuthButton>
              </div>
            </form>

            <div className="mt-8 text-center text-sm font-medium">
              <Link to="/login" className="text-zinc-400 hover:text-neon-500 transition-colors">
                로그인으로 돌아가기
              </Link>
            </div>
          </div>
        )}

        {step === "reset-pw" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">새 비밀번호 설정</h2>
              <p className="mt-2 text-sm text-zinc-400 font-medium">
                인증이 완료되었습니다. 새로운 비밀번호를 입력해주세요.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <AuthInput
                label="새 비밀번호"
                icon={Lock}
                name="newPassword"
                type="password"
                required
                placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                value={formData.newPassword}
                onChange={handleChange}
              />
              <AuthInput
                label="비밀번호 확인"
                icon={CheckCircle2}
                name="confirmPassword"
                type="password"
                required
                placeholder="재입력"
                value={formData.confirmPassword}
                onChange={handleChange}
                success={
                  formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword
                    ? "비밀번호가 일치합니다"
                    : undefined
                }
              />

              {errorMsg && (
                <p className="text-sm text-red-500 font-medium text-center bg-red-500/10 py-2 rounded-lg">
                  {errorMsg}
                </p>
              )}

              <div className="pt-4">
                <AuthButton type="submit" isLoading={isLoading} icon={CheckCircle2}>
                  비밀번호 변경하기
                </AuthButton>
              </div>
            </form>
          </div>
        )}

        {step === "success" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-neon-500/10 rounded-full flex items-center justify-center border border-neon-500/30">
                <CheckCircle2 className="w-8 h-8 text-neon-500" />
              </div>
            </div>
            
            {isFindId ? (
              <>
                <h2 className="text-2xl font-extrabold text-white mb-2">아이디 찾기 성공</h2>
                <p className="text-sm text-zinc-400 mb-6">입력하신 정보와 일치하는 아이디입니다.</p>
                <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 mb-8">
                  <p className="text-lg font-bold text-white tracking-wider">{foundId}</p>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-white mb-2">비밀번호 변경 완료</h2>
                <p className="text-sm text-zinc-400 mb-8">
                  비밀번호가 성공적으로 재설정되었습니다.<br />새로운 비밀번호로 로그인해 주세요.
                </p>
              </>
            )}

            <AuthButton to="/login" icon={ArrowRight}>
              로그인하러 가기
            </AuthButton>
          </div>
        )}
      </div>
    </div>
  );
}
