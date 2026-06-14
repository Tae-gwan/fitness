package com.example.fitness.repository;

import com.example.fitness.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 로그인 및 대상 회원 조회 시 사용
    Optional<User> findByUsername(String username);

    // 회원가입 및 실시간 중복 체크 시 사용
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // 💡 아이디 찾기: 이메일 + 질문 번호 + 답변으로 조회
    Optional<User> findByEmailAndFindPasswordQuestionIdAndFindPasswordAnswer(
            String email, Long questionId, String answer);

    // 💡 비밀번호 재설정 1단계: 아이디 + 질문 번호 + 답변으로 검증 조회
    Optional<User> findByUsernameAndFindPasswordQuestionIdAndFindPasswordAnswer(
            String username, Long questionId, String answer);
}