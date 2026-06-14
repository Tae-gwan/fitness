package com.example.fitness.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 고유 번호 (PK)

    @Column(nullable = false, unique = true)
    private String username; // 로그인 아이디 (중복 불가)

    @Column(nullable = false)
    private String password; // 비밀번호

    @Column(nullable = false)
    private String name; // 사용자 이름

    @Column(nullable = false, unique = true)
    private String email; // 이메일 (중복 불가)

    @Column(nullable = false)
    private Long findPasswordQuestionId; // 프론트에서 넘겨주는 질문 고유 번호(ID)

    @Column(nullable = false)
    private String findPasswordAnswer; // 질문에 대한 답변

    @Builder
    public User(String username, String password, String name, String email, Long findPasswordQuestionId, String findPasswordAnswer) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.findPasswordQuestionId = findPasswordQuestionId;
        this.findPasswordAnswer = findPasswordAnswer;
    }
}