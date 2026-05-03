package com.rentacar.controller;

import com.rentacar.entity.User;
import com.rentacar.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // ✅ REGISTER USER
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    // ✅ REGISTER ADMIN
    @PostMapping("/register-admin")
    public User registerAdmin(@RequestBody User user) {
        return userService.registerAdmin(user);
    }

    // ✅ LOGIN
@PostMapping("/login")
public User login(@RequestBody java.util.Map<String, String> body) {
    return userService.login(body.get("email"), body.get("password"));
}
}