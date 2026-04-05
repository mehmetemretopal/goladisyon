package com.adisyon.backend.controller;

import com.adisyon.backend.entity.AppUser;
import com.adisyon.backend.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public List<AppUser> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public AppUser createUser(@RequestBody AppUser user) {
        // give generic password if missing
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            user.setPassword("123456");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @PutMapping("/{id}/displayName")
    public AppUser updateDisplayName(@PathVariable Long id, @RequestBody String displayName) {
        AppUser user = userRepository.findById(id).orElseThrow();
        user.setDisplayName(displayName.replace("\"", ""));
        return userRepository.save(user);
    }

    @PutMapping("/{id}/role")
    public AppUser updateRole(@PathVariable Long id, @RequestBody String role) {
        AppUser user = userRepository.findById(id).orElseThrow();
        user.setRole(role.replace("\"", ""));
        return userRepository.save(user);
    }
}
