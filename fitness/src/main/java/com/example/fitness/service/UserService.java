package com.example.fitness.service;

import com.example.fitness.entity.User;
import com.example.fitness.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // 회원가입 로직
    @Transactional
    public void join(User user) {
        // 비밀번호를 암호화해서 저장
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        userRepository.save(user);
    }
    // UserService.java에 추가
    public boolean login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElse(null); // 사용자 찾기

        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return true; // 비밀번호 일치!
        }
        return false; // 로그인 실패
    }
}
