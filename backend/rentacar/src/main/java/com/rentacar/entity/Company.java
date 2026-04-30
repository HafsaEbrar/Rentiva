package com.rentacar.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Company name cannot be empty")
    @Column(nullable = false, unique = true)
    private String companyName;

    @NotBlank(message = "Tax number cannot be empty")
    @Column(nullable = false, unique = true)
    private String taxNo;

    @NotBlank(message = "Address cannot be empty")
    private String address;

    @NotBlank(message = "Phone cannot be empty")
    private String phone;

    @Email(message = "Invalid email format")
    private String email;
}