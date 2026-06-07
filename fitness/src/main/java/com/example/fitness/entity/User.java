package com.example.fitness.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users") // 테이블 이름을 명시적으로 지정
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // DB에서 사용할 고유 번호 (PK)

    @Column(nullable = false, unique = true)
    private String username; // 로그인 아이디

    @Column(nullable = false)
    private String password; // 비밀번호 (나중에 암호화 예정)

    @Column(nullable = false)
    private String email; // 이메일

    private String name; // 사용자 이름
}