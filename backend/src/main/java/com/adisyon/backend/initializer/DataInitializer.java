package com.adisyon.backend.initializer;

import com.adisyon.backend.entity.AppUser;
import com.adisyon.backend.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            
            // 1. Admin Kullanıcısı
            AppUser admin = new AppUser();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("admin");
            admin.setDisplayName("Sistem Yöneticisi");
            admin.setCreatedAt(LocalDateTime.now());
            userRepository.save(admin);

            // 2. Garson - Aile Alanı
            AppUser aileGarson = new AppUser();
            aileGarson.setUsername("garson_aile");
            aileGarson.setPassword(passwordEncoder.encode("aile123"));
            aileGarson.setRole("garson");
            aileGarson.setDisplayName("Aile Bölümü");
            aileGarson.setCreatedAt(LocalDateTime.now());
            userRepository.save(aileGarson);

            // 3. Garson - Kadın Alanı
            AppUser kadinGarson = new AppUser();
            kadinGarson.setUsername("garson_kadin");
            kadinGarson.setPassword(passwordEncoder.encode("kadin123"));
            kadinGarson.setRole("garson");
            kadinGarson.setDisplayName("Kadın Bölümü");
            kadinGarson.setCreatedAt(LocalDateTime.now());
            userRepository.save(kadinGarson);

            // 4. Garson - Erkek Alanı
            AppUser erkekGarson = new AppUser();
            erkekGarson.setUsername("garson_erkek");
            erkekGarson.setPassword(passwordEncoder.encode("erkek123"));
            erkekGarson.setRole("garson");
            erkekGarson.setDisplayName("Erkek Bölümü");
            erkekGarson.setCreatedAt(LocalDateTime.now());
            userRepository.save(erkekGarson);

            System.out.println("✅ Başlangıç kullanıcıları (Admin ve bölgeye özel Garsonlar) oluşturuldu.");
        }
    }
}
