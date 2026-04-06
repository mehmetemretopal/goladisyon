package com.adisyon.backend.controller;
import com.adisyon.backend.repository.AppUserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return userRepository.findByUsername(request.getUsername())
                .map(user -> {
                    if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        return ResponseEntity.ok(new LoginResponse(user.getUsername(), user.getRole(), user.getDisplayName()));
                    } else {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found"));
    }
}

@Data
class LoginRequest {
    private String username;
    private String password;
}

@Data
class LoginResponse {
    private String username;
    private String role;
    private String displayName;

    public LoginResponse(String username, String role, String displayName) {
        this.username = username;
        this.role = role.toLowerCase();
        this.displayName = displayName;
    }
}
