package com.rentacar.controller;

import com.rentacar.entity.Customer;
import com.rentacar.entity.User;
import com.rentacar.repository.CustomerRepository;
import com.rentacar.security.JwtUtil;
import com.rentacar.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final CustomerRepository customerRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PostMapping("/register")
    public User register(@RequestBody Map<String, String> body) {

        User user = new User();

        user.setFullName(body.get("fullName"));
        user.setNationalId(body.get("nationalId"));
        user.setEmail(body.get("email"));
        user.setPhone(body.get("phone"));
        user.setPassword(body.get("password"));

        // EHLİYET BİLGİLERİ
        user.setDriverLicenseNumber(body.get("driverLicenseNumber"));
        user.setLicenseImage(body.get("licenseImage"));

        // DOĞUM TARİHİ
        String birthDateStr = body.get("birthDate");

        if (birthDateStr != null && !birthDateStr.isEmpty()) {
            user.setBirthDate(LocalDate.parse(birthDateStr));
        }

        return userService.register(user);
    }

    @PostMapping("/register-admin")
    public User registerAdmin(@RequestBody Map<String, String> body) {

        User user = new User();

        user.setFullName(body.get("fullName"));
        user.setNationalId(body.get("nationalId"));
        user.setEmail(body.get("email"));
        user.setPhone(body.get("phone"));
        user.setPassword(body.get("password"));

        String companyName = body.get("companyName");
        String taxNumber = body.get("taxNumber");
        String phone = body.get("sirketTel");
        String email = body.get("email");
        String city = body.get("city");
        String district = body.get("district");
        String mahalle = body.get("mahalle");
        String sokak = body.get("sokak");
        String binaNo = body.get("binaNo");

        return userService.registerAdmin(
                user,
                companyName,
                taxNumber,
                phone,
                email,
                city,
                district,
                mahalle,
                sokak,
                binaNo
        );
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {

        User user = userService.login(
                body.get("email"),
                body.get("password")
        );

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole()
        );

        Long customerId = null;

        Optional<Customer> customer =
                customerRepository.findByUserId(user.getId());

        if (customer.isPresent()) {
            customerId = customer.get().getId();
        }

        Map<String, Object> response = new HashMap<>();

        response.put("token", token);
        response.put("user", user);
        response.put("customerId", customerId);

        return response;
    }
}