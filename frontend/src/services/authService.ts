import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      username,
      password,
    });
    
    // 친구 백엔드 응답 형태: { token: "JWT문자열", name: "홍길동" }
    const token = response.data.token || response.data;
    const name = response.data.name || username;
    
    return {
      ok: true,
      accessToken: token,
      refreshToken: "dummy-refresh-token",
      user: {
        id: "user",
        username: username,
        email: "",
        ownerName: name,
      },
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.response?.data || "아이디 또는 비밀번호가 일치하지 않습니다.",
    };
  }
};

export const checkIdAvailability = async (username: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/check-username?username=${username}`);
    return { ok: true, message: response.data };
  } catch (error: any) {
    return { ok: false, message: error.response?.data || "이미 존재하는 아이디입니다." };
  }
};

// 백엔드에 이메일 중복확인 API가 없으므로 임시로 무조건 통과시키는 Mock 함수 (UI에서 제거 예정)
export const checkEmailAvailability = async (email: string) => {
  return { ok: true };
};

export const findId = async (data: { email: string, questionId: number, answer: string }) => {
  try {
    const response = await axios.post(`${API_URL}/users/find-id`, data);
    return { ok: true, foundId: response.data };
  } catch (error: any) {
    return { ok: false, message: error.response?.data || "일치하는 회원 정보를 찾을 수 없습니다." };
  }
};

export const verifyResetAuth = async (data: { username: string, questionId: number, answer: string }) => {
  try {
    const response = await axios.post(`${API_URL}/users/verify-reset`, data);
    return { ok: true, message: response.data };
  } catch (error: any) {
    return { ok: false, message: error.response?.data || "일치하는 회원 정보를 찾을 수 없습니다." };
  }
};

export const resetPassword = async (data: { username: string, newPassword: string }) => {
  try {
    const response = await axios.post(`${API_URL}/users/change-password`, data);
    return { ok: true, message: response.data };
  } catch (error: any) {
    return { ok: false, message: error.response?.data || "비밀번호 변경에 실패했습니다." };
  }
};

export const signup = async (data: any, signupToken: string): Promise<{ok: boolean, message?: string}> => {
  try {
    const response = await axios.post(`${API_URL}/users/signup`, {
      username: data.userName,
      password: data.password,
      name: data.name,
      email: data.email,
      questionId: data.securityQuestionId,
      answer: data.securityAnswer,
    });
    
    return { ok: true, message: response.data }; 
  } catch (error: any) {
    return { 
      ok: false, 
      message: error.response?.data || "회원가입에 실패했습니다. (서버 오류 또는 중복된 아이디)" 
    };
  }
};
