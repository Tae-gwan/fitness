import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// 유틸리티: 임의의 딜레이(가짜 통신 지연)를 생성하는 함수
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });
    
    // 백엔드에서 토큰을 문자열로 반환함
    const token = response.data;
    
    return {
      ok: true,
      accessToken: token,
      // Refresh Token은 백엔드 구현 전까지 더미로 둡니다
      refreshToken: "dummy-refresh-token",
      // 현재 백엔드에서 유저 상세 정보를 안 주므로 임시 맵핑
      user: {
        id: "user",
        username: username,
        email: "",
        ownerName: username,
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
  await delay(500);
  // 아직 백엔드 API 없음 - 무조건 통과
  return { ok: true };
};

export const requestEmailVerification = async (email: string, type: string): Promise<{ok: boolean, message?: string}> => {
  await delay(500);
  // 아직 백엔드 API 없음 - 무조건 통과
  return { ok: true };
};

export const verifyEmailCode = async (email: string, code: string, type: string) => {
  await delay(500);
  // 아직 백엔드 API 없음 - 무조건 통과
  return { ok: true, signupToken: "fake-signup-token" };
};

export const signup = async (data: any, signupToken: string): Promise<{ok: boolean, message?: string}> => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      username: data.userName,
      password: data.password,
      name: data.name,
      securityQuestion: data.securityQuestion,
      securityAnswer: data.securityAnswer,
    });
    
    return { ok: true, message: response.data }; // "회원가입 성공"
  } catch (error: any) {
    return { 
      ok: false, 
      message: error.response?.data?.message || "회원가입에 실패했습니다. (서버 오류 또는 중복된 아이디)" 
    };
  }
};
