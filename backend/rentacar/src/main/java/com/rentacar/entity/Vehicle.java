package com.rentacar.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String plateNo;

    private Integer year;
    private Double dailyPrice;
    private String status;
    private String description;

    private Boolean hasAirConditioning;
    private Boolean hasChildSeat;
    private Boolean hasAppleCarplay;
    private Boolean hasRearViewCamera;
    private Boolean hasBluetooth;
    private Boolean hasNavigation;
    private Integer airbagCount;

    @ManyToOne
    @JoinColumn(name = "model_id")
    private VehicleModel model;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
}