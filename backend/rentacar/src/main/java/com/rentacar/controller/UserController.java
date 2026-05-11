package com.rentacar.controller;

import com.rentacar.entity.Customer;
import com.rentacar.entity.User;
import com.rentacar.repository.CustomerRepository;
import com.rentacar.security.JwtUtil;
import com.rentacar.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

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
    private final CustomerRepository customerRepository; // ← EKLE

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
        return userService.registerAdmin(user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        User user = userService.login(body.get("email"), body.get("password"));
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        // Customer ID'yi bul
        Long customerId = null;
        Optional<Customer> customer = customerRepository.findByUserId(user.getId());
        if (customer.isPresent()) {
            customerId = customer.get().getId();
        }

        // Map.of immutable olduğu için HashMap kullan
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        response.put("customerId", customerId); // ← EKLE
        return response;
    }
}