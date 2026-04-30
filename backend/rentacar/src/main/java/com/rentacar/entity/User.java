package com.rentacar.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String nationalId;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;
    private String password;
    private LocalDate registrationDate;
    private Boolean isActive;
}