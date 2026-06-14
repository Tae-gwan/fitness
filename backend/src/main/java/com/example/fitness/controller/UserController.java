package com.example.fitness.controller;

import com.example.fitness.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 💡 1. 아이디 중복 확인 API
    // GET /api/users/check-username?username=유저아이디
    @GetMapping("/check-username")
    public ResponseEntity<String> checkUsername(@RequestParam("username") String username) {
        boolean isDuplicate = userService.checkUsernameDuplicate(username);
        if (isDuplicate) {
            return ResponseEntity.badRequest().body("이미 존재하는 아이디입니다.");
        }
        return ResponseEntity.ok("사용 가능한 아이디입니다.");
    }

    // 💡 2. 회원가입 API
    // POST /api/users/signup
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        try {
            userService.registerUser(
                    request.getUsername(),
                    request.getPassword(),
                    request.getName(),
                    request.getEmail(),
                    request.getQuestionId(),
                    request.getAnswer()
            );
            return ResponseEntity.ok("회원가입이 성공적으로 완료되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 💡 3. 아이디 찾기 API (이메일 + 질문답변)
    // POST /api/users/find-id
    @PostMapping("/find-id")
    public ResponseEntity<String> findId(@RequestBody FindIdRequest request) {
        try {
            String username = userService.findUsername(
                    request.getEmail(),
                    request.getQuestionId(),
                    request.getAnswer()
            );
            return ResponseEntity.ok(username);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 💡 4. 비밀번호 재설정 1단계: 질문/답변 검증 API
    // POST /api/users/verify-reset
    @PostMapping("/verify-reset")
    public ResponseEntity<String> verifyReset(@RequestBody VerifyResetRequest request) {
        try {
            userService.verifyPasswordReset(
                    request.getUsername(),
                    request.getQuestionId(),
                    request.getAnswer()
            );
            return ResponseEntity.ok("질문 검증 성공. 다음 단계로 진행합니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 💡 5. 비밀번호 재설정 2단계: 최종 비밀번호 변경 API
    // POST /api/users/change-password
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            userService.changePassword(request.getUsername(), request.getNewPassword());
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- 통신용 DTO 구조체 정의 ---

    @Data
    public static class SignupRequest {
        private String username;
        private String password;
        private String name;
        private String email;
        private Long questionId;
        private String answer;
    }

    @Data
    public static class FindIdRequest {
        private String email;
        private Long questionId;
        private String answer;
    }

    @Data
    public static class VerifyResetRequest {
        private String username;
        private Long questionId;
        private String answer;
    }

    @Data
    public static class ChangePasswordRequest {
        private String username;
        private String newPassword;
    }
}