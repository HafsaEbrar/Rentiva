package com.rentacar.service;

import com.rentacar.entity.User;
import com.rentacar.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 🔹 TÜM KULLANICILAR
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 🔹 ID İLE KULLANICI
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // 🔹 KAYDET (GENEL)
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // 🔹 SİL
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // ✅ REGISTER
    public User register(User user) {

        // email kontrol
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Bu email zaten kayıtlı");
        }

        user.setIsActive(true);
        user.setRegistrationDate(java.time.LocalDate.now());

        // 🔥 ŞİFRE HASH
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    // ✅ LOGIN
    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        // 🔥 HASH KARŞILAŞTIRMA
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Şifre yanlış");
        }

        // 🔐 ŞİFREYİ GİZLE
        user.setPassword(null);

        return user;
    }
}

