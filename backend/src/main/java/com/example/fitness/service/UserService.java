package com.example.fitness.service;

import com.example.fitness.config.JwtTokenProvider; // 💡 프로젝트의 올바른 패키지 경로로 확인해주세요
import com.example.fitness.entity.User;
import com.example.fitness.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider; // 💡 JWT 토큰 발행을 위해 주입 추가

    // 💡 [복구] 로그인 로직 (아이디, 비밀번호 확인 후 JWT 토큰 반환)
    public String login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디입니다."));

        // 암호화된 비밀번호 일치 여부 확인
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 비밀번호가 맞으면 JWT 토큰 발행 및 반환
        return jwtTokenProvider.createToken(user.getUsername());
    }

    // 아이디로 이름 조회
    public String getNameByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(User::getName)
                .orElse(username); // 이름을 못 찾으면 기본값으로 아이디 반환
    }

    // 아이디 중복 확인
    public boolean checkUsernameDuplicate(String username) {
        return userRepository.existsByUsername(username);
    }

    // 회원가입
    @Transactional
    public void registerUser(String username, String password, String name, String email, Long questionId, String answer) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .name(name)
                .email(email)
                .findPasswordQuestionId(questionId)
                .findPasswordAnswer(answer)
                .build();

        userRepository.save(user);
    }

    // 아이디 찾기
    public String findUsername(String email, Long questionId, String answer) {
        User user = userRepository.findByEmailAndFindPasswordQuestionIdAndFindPasswordAnswer(email, questionId, answer)
                .orElseThrow(() -> new IllegalArgumentException("일치하는 회원 정보가 없습니다."));
        return user.getUsername();
    }

    // 비밀번호 재설정 1단계: 검증
    public void verifyPasswordReset(String username, Long questionId, String answer) {
        userRepository.findByUsernameAndFindPasswordQuestionIdAndFindPasswordAnswer(username, questionId, answer)
                .orElseThrow(() -> new IllegalArgumentException("입력하신 비밀번호 찾기 질문과 답변이 일치하지 않습니다."));
    }

    // 비밀번호 재설정 2단계: 변경
    @Transactional
    public void changePassword(String username, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        user.setPassword(passwordEncoder.encode(newPassword));
    }
}