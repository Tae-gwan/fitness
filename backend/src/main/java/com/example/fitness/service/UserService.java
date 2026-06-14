package com.example.fitness.service;

import com.example.fitness.entity.User;
import com.example.fitness.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // 💡 1. 아이디 중복 확인 비즈니스 로직
    public boolean checkUsernameDuplicate(String username) {
        return userRepository.existsByUsername(username);
    }

    // 💡 2. 회원가입 (가입 시에도 이중 방어 체크)
    @Transactional
    public void registerUser(String username, String password, String name, String email, Long questionId, String answer) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 💡 JWT 로그인 환경이라면, 여기서 패스워드 저장 시 passwordEncoder.encode(password)를 거쳐야 합니다!
        User user = User.builder()
                .username(username)
                .password(password)
                .name(name)
                .email(email)
                .findPasswordQuestionId(questionId)
                .findPasswordAnswer(answer)
                .build();

        userRepository.save(user);
    }

    // 3. 아이디 찾기
    public String findUsername(String name, String email, Long questionId, String answer) {
        User user = userRepository.findByNameAndEmailAndFindPasswordQuestionIdAndFindPasswordAnswer(name, email, questionId, answer)
                .orElseThrow(() -> new IllegalArgumentException("일치하는 회원 정보가 없습니다."));
        return user.getUsername();
    }

    // 4. 비밀번호 재설정
    @Transactional
    public void resetPassword(String username, String name, String email, Long questionId, String answer, String newPassword) {
        User user = userRepository.findByUsernameAndNameAndEmailAndFindPasswordQuestionIdAndFindPasswordAnswer(username, name, email, questionId, answer)
                .orElseThrow(() -> new IllegalArgumentException("일치하는 회원 정보가 없습니다."));

        // 💡 비밀번호 변경 시에도 JWT 가동을 위해 나중에 암호화 인코딩을 적용해 주어야 합니다.
        user.setPassword(newPassword);
    }
}