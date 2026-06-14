import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Mail, Lock, CheckCircle2, ArrowRight, ShieldQuestion, KeyRound } from "lucide-react";

import AuthInput from "@/components/ui/AuthInput";
import AuthButton from "@/components/ui/AuthButton";
import { findIdStep1_checkEmail, findIdStep2_verifyAnswer } from "@/services/authService";

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

  // Steps for Find ID: "email" -> "question" -> "success"
  // Steps for Reset PW (kept minimal for now): "email" -> "reset" -> "success"
  const [step, setStep] = useState<"email" | "question" | "reset" | "success">("email");
  
  const [email, setEmail] = useState("");
  const [securityQuestionId, setSecurityQuestionId] = useState<number | null>(null);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [foundId, setFoundId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNextStepEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email) {
      setErrorMsg("이메일을 입력해주세요.");
      return;
    }
    
    setIsLoading(true);
    const result = await findIdStep1_checkEmail(email);
    setIsLoading(false);

    if (result.ok && result.securityQuestionId) {
      setSecurityQuestionId(result.securityQuestionId);
      setStep("question");
    } else {
      setErrorMsg("가입된 이메일을 찾을 수 없습니다.");
    }
  };

  const handleVerifyAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!securityAnswer) {
      setErrorMsg("답변을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    const result = await findIdStep2_verifyAnswer(email, securityAnswer);
    setIsLoading(false);

    if (result.ok) {
      if (isFindId && result.foundId) {
        setFoundId(result.foundId);
        setStep("success");
      } else {
        // 비밀번호 찾기(재설정)일 경우, 정답이 맞으면 재설정 창으로 이동
        setStep("reset");
      }
    } else {
      setErrorMsg(result.message || "답변이 일치하지 않습니다.");
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === "email" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{pageTitle}</h2>
              <p className="mt-2 text-sm text-zinc-400 font-medium">
                가입 시 등록한 이메일을 입력해 주세요.
              </p>
            </div>

            <form onSubmit={handleNextStepEmail} className="space-y-6">
              <AuthInput
                label="이메일"
                icon={Mail}
                name="email"
                type="email"
                required
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg("");
                }}
                error={errorMsg}
              />
              <div className="pt-2">
                <AuthButton type="submit" isLoading={isLoading} icon={ArrowRight}>
                  다음
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

        {step === "question" && securityQuestionId && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">보안 질문 확인</h2>
              <p className="mt-2 text-sm text-zinc-400 font-medium">
                회원가입 시 등록했던 질문에 답해 주세요.
              </p>
            </div>

            <form onSubmit={handleVerifyAnswer} className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6 text-center">
                <ShieldQuestion className="w-8 h-8 text-neon-500 mx-auto mb-3" />
                <p className="text-base font-bold text-white">
                  Q. {SECURITY_QUESTIONS[securityQuestionId] || "등록된 질문을 찾을 수 없습니다."}
                </p>
              </div>

              <AuthInput
                label="답변"
                icon={KeyRound}
                name="answer"
                type="text"
                required
                placeholder="답변을 입력해 주세요"
                value={securityAnswer}
                onChange={(e) => {
                  setSecurityAnswer(e.target.value);
                  setErrorMsg("");
                }}
                error={errorMsg}
              />
              <div className="pt-2">
                <AuthButton type="submit" isLoading={isLoading}>
                  확인
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

        {step === "reset" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">새 비밀번호 설정</h2>
              <p className="mt-2 text-sm text-zinc-400 font-medium">
                새롭게 사용할 비밀번호를 입력해 주세요.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <AuthInput
                label="새 비밀번호"
                icon={Lock}
                name="password"
                type="password"
                required
                placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <AuthInput
                label="비밀번호 확인"
                icon={CheckCircle2}
                name="confirmPassword"
                type="password"
                required
                placeholder="재입력"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                success={
                  password && confirmPassword && password === confirmPassword
                    ? "비밀번호가 일치합니다"
                    : undefined
                }
              />
              <div className="pt-4">
                <AuthButton type="submit" isLoading={isLoading} icon={ArrowRight}>
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
                <h2 className="text-2xl font-extrabold text-white mb-2">아이디 찾기 완료</h2>
                <p className="text-sm text-zinc-400 mb-6">고객님의 아이디 정보입니다.</p>
                <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 mb-8">
                  <p className="text-lg font-bold text-white tracking-wider">{foundId}</p>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-white mb-2">비밀번호 변경 완료</h2>
                <p className="text-sm text-zinc-400 mb-8">
                  비밀번호가 성공적으로 변경되었습니다.<br />새로운 비밀번호로 로그인해 주세요.
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
