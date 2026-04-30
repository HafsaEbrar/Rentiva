package com.rentacar.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "managers")
public class Manager {

    @Id
    @Column(name = "user_id")
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String jobTitle;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
}