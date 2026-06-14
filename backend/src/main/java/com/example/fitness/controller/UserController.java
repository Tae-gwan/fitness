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
    // 프론트에서 /api/users/check-username?username=testuser 형태로 요청을 보냅니다.
    @GetMapping("/check-username")
    public ResponseEntity<String> checkUsername(@RequestParam("username") String username) {
        boolean isDuplicate = userService.checkUsernameDuplicate(username);
        if (isDuplicate) {
            return ResponseEntity.badRequest().body("이미 존재하는 아이디입니다.");
        }
        return ResponseEntity.ok("사용 가능한 아이디입니다.");
    }

    // 💡 2. 회원가입 API
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

    // 💡 3. 아이디 찾기 API
    @PostMapping("/find-id")
    public ResponseEntity<String> findId(@RequestBody FindIdRequest request) {
        try {
            String username = userService.findUsername(
                    request.getName(),
                    request.getEmail(),
                    request.getQuestionId(),
                    request.getAnswer()
            );
            return ResponseEntity.ok(username);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 💡 4. 비밀번호 재설정 API
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            userService.resetPassword(
                    request.getUsername(),
                    request.getName(),
                    request.getEmail(),
                    request.getQuestionId(),
                    request.getAnswer(),
                    request.getNewPassword()
            );
            return ResponseEntity.ok("비밀번호가 성공적으로 재설정되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- 통신용 DTO 구조체 ---
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
        private String name;
        private String email;
        private Long questionId;
        private String answer;
    }

    @Data
    public static class ResetPasswordRequest {
        private String username;
        private String name;
        private String email;
        private Long questionId;
        private String answer;
        private String newPassword;
    }
}