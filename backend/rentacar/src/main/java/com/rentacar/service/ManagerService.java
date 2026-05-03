package com.rentacar.service;

import com.rentacar.entity.Manager;
import com.rentacar.entity.User;
import com.rentacar.repository.ManagerRepository;
import com.rentacar.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ManagerService {

    private final ManagerRepository managerRepository;
    private final UserRepository userRepository;

    public List<Manager> getAllManagers() {
        return managerRepository.findAll();
    }

    public Manager getManagerById(Long id) {
        return managerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Manager bulunamadı"));
    }

    public Manager createManager(Long userId, String jobTitle) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        if (!"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Bu kullanıcı admin değil");
        }

        Manager manager = new Manager();
        manager.setUser(user);
        manager.setJobTitle(jobTitle);

        return managerRepository.save(manager);
    }

    public void deleteManager(Long id) {
        if (!managerRepository.existsById(id)) {
            throw new RuntimeException("Manager bulunamadı");
        }
        managerRepository.deleteById(id);
    }
}