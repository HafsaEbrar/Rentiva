package com.rentacar.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false, length = 11)
    private String nationalId;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    private LocalDate registrationDate;
    private Boolean isActive;

    private String role;

    private String driverLicenseNumber;
    private String licenseImage;

    private String companyName;
    private String taxNumber;
    
    private String city;
    private String district;
    private String neighborhood;
    private String street;
    private String buildingNo;
}