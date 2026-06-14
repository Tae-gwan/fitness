package com.example.fitness.service;

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
    private final BCryptPasswordEncoder passwordEncoder; // SecurityConfig의 인코더 주입

    // 💡 1. 아이디 중복 확인
    public boolean checkUsernameDuplicate(String username) {
        return userRepository.existsByUsername(username);
    }

    // 💡 2. 회원가입 (비밀번호 암호화 및 아이디/이메일 중복 최종 방어)
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
                .password(passwordEncoder.encode(password)) // BCrypt 암호화 적용
                .name(name)
                .email(email)
                .findPasswordQuestionId(questionId)
                .findPasswordAnswer(answer)
                .build();

        userRepository.save(user);
    }

    // 💡 3. 아이디 찾기 (이메일 + 질문답변 기반)
    public String findUsername(String email, Long questionId, String answer) {
        User user = userRepository.findByEmailAndFindPasswordQuestionIdAndFindPasswordAnswer(email, questionId, answer)
                .orElseThrow(() -> new IllegalArgumentException("일치하는 회원 정보가 없습니다."));
        return user.getUsername();
    }

    // 💡 4. 비밀번호 재설정 1단계: 질문/답변 검증
    public void verifyPasswordReset(String username, Long questionId, String answer) {
        userRepository.findByUsernameAndFindPasswordQuestionIdAndFindPasswordAnswer(username, questionId, answer)
                .orElseThrow(() -> new IllegalArgumentException("입력하신 비밀번호 찾기 질문과 답변이 일치하지 않습니다."));
    }

    // 💡 5. 비밀번호 재설정 2단계: 최종 비밀번호 변경
    @Transactional
    public void changePassword(String username, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        user.setPassword(passwordEncoder.encode(newPassword)); // 변경 시에도 암호화 적용
    }
}