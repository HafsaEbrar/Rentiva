package com.rentacar.service;

import com.rentacar.entity.Company;
import com.rentacar.entity.Customer;
import com.rentacar.entity.User;
import com.rentacar.repository.CustomerRepository;
import com.rentacar.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import com.rentacar.service.CompanyService;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final CompanyService companyService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // ✅ USER REGISTER
    public User register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Bu email zaten kayıtlı");
        }

        if (user.getNationalId() == null || user.getNationalId().length() != 11) {
            throw new RuntimeException("TC Kimlik 11 haneli olmalı");
        }

        // 18 yaş kontrolü
        if (user.getBirthDate() == null) {
            throw new RuntimeException("Doğum tarihi girilmeli");
        }
        if (user.getBirthDate().plusYears(18).isAfter(LocalDate.now())) {
            throw new RuntimeException("18 yaşından küçükler kayıt olamaz");
        }

        user.setRole("USER");
        user.setIsActive(true);
        user.setRegistrationDate(LocalDate.now());
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);

        Customer customer = new Customer();
        customer.setUser(savedUser);
        customer.setDriverLicenseNo("");
        customer.setDriverLicenseImage("");
        customerRepository.save(customer);

        return savedUser;
    }

    @Transactional
    public User registerAdmin(User user, String companyName, String taxNumber,
                              String phone, String email, String city, String district,
                              String mahalle, String sokak, String binaNo) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Bu email zaten kayıtlı");
        }

        user.setRole("ADMIN");
        user.setIsActive(true);
        user.setRegistrationDate(LocalDate.now());
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);

        Company company = new Company();
        company.setCompanyName(companyName);
        company.setTaxNo(taxNumber);
        company.setPhone(phone);
        company.setEmail(email);
        company.setIl(city);
        company.setIlce(district);
        company.setMahalle(mahalle);
        company.setSokak(sokak);
        company.setBinaNo(binaNo);
        companyService.saveCompany(company);

        return savedUser;
    }

    // ✅ LOGIN
    public User login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Şifre yanlış");
        }

        user.setPassword(null);
        return user;
    }
}