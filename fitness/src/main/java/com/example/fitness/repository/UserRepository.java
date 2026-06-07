package com.example.fitness.repository;

import com.example.fitness.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Optional을 사용하여, 결과가 없을 경우(null)를 안전하게 처리합니다.
    Optional<User> findByUsername(String username);

}