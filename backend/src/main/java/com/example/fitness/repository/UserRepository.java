package com.example.fitness.repository;

import com.example.fitness.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // JWT 로그인 및 중복 확인 시 사용
    Optional<User> findByUsername(String username);

    // 💡 중복 확인 전용 메서드 (있으면 true, 없으면 false 반환)
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // 아이디 찾기
    Optional<User> findByNameAndEmailAndFindPasswordQuestionIdAndFindPasswordAnswer(
            String name, String email, Long questionId, String answer);

    // 비밀번호 재설정
    Optional<User> findByUsernameAndNameAndEmailAndFindPasswordQuestionIdAndFindPasswordAnswer(
            String username, String name, String email, Long questionId, String answer);
}