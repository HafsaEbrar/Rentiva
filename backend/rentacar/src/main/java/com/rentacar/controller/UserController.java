package com.rentacar.controller;

import com.rentacar.entity.User;
import com.rentacar.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

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
    public User login(@RequestBody Map<String, String> body) {
        return userService.login(body.get("email"), body.get("password"));
    }
}