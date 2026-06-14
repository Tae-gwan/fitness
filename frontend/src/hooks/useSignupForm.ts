import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  isRequired,
} from "@/lib/validation";
import {
  checkIdAvailability,
  signup
} from "@/services/authService";

export const useSignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    ownerName: "",
    securityQuestionId: "1",
    securityAnswer: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<{ [key: string]: string }>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [isIdChecking, setIsIdChecking] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;

    if (name === "password" || name === "confirmPassword") {
      const nextPassword = name === "password" ? value : formData.password;
      const nextConfirmPassword = name === "confirmPassword" ? value : formData.confirmPassword;

      if (nextPassword && nextConfirmPassword && nextPassword !== nextConfirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "비밀번호가 일치하지 않습니다." }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.confirmPassword;
          return newErrors;
        });
      }

      if (name === "password") {
        if (value.length > 0 && !validatePassword(value)) {
          setErrors((prev) => ({ ...prev, password: "영문, 숫자, 특수문자 포함 8자 이상 입력해 주세요." }));
          setSuccess((prev) => {
            const newSuccess = { ...prev };
            delete newSuccess.password;
            return newSuccess;
          });
        } else if (value.length > 0 && validatePassword(value)) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.password;
            return newErrors;
          });
          setSuccess((prev) => ({ ...prev, password: "안전한 비밀번호입니다." }));
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.password;
            return newErrors;
          });
          setSuccess((prev) => {
            const newSuccess = { ...prev };
            delete newSuccess.password;
            return newSuccess;
          });
        }
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name !== "confirmPassword" && name !== "password" && errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name !== "password" && success[name]) {
      setSuccess((prev) => {
        const newSuccess = { ...prev };
        delete newSuccess[name];
        return newSuccess;
      });
    }
  };

  const checkIdDuplicate = async () => {
    if (!formData.username) {
      setErrors((prev) => ({ ...prev, username: "아이디를 입력해주세요." }));
      return;
    }
    setIsIdChecking(true);
    const result = await checkIdAvailability(formData.username);

    if (result.ok) {
      setSuccess((prev) => ({ ...prev, username: "사용 가능한 아이디입니다." }));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.username;
        return newErrors;
      });
    } else {
      setErrors((prev) => ({ ...prev, username: result.message || "이미 사용 중인 아이디입니다." }));
    }
    setIsIdChecking(false);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!isRequired(formData.username)) newErrors.username = "아이디를 입력해 주세요.";
    if (!validateEmail(formData.email)) newErrors.email = "올바른 이메일 형식이 아닙니다.";
    if (!validatePassword(formData.password)) newErrors.password = "영문, 숫자, 특수문자 포함 8자 이상 입력해 주세요.";
    if (!validateConfirmPassword(formData.password, formData.confirmPassword)) newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    if (!isRequired(formData.ownerName)) newErrors.ownerName = "이름을 입력해 주세요.";
    if (!isRequired(formData.securityAnswer)) newErrors.securityAnswer = "보안 질문에 대한 답변을 입력해 주세요.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const result = await signup({
      userName: formData.username,
      email: formData.email,
      password: formData.password,
      name: formData.ownerName,
      securityQuestionId: Number(formData.securityQuestionId),
      securityAnswer: formData.securityAnswer,
    }, "temporary-bypass-token");

    if (result.ok) {
      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate("/login");
    } else {
      alert(result.message || "회원가입에 실패했습니다.");
    }
    setIsLoading(false);
  };

  return {
    form: {
      data: formData,
      errors,
      success,
      handleChange,
      handleSubmit,
    },
    status: {
      isLoading,
      isIdChecking,
    },
    actions: {
      checkIdDuplicate,
    },
  };
};
