package com.rentacar.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "vehicle_models")
public class VehicleModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String modelName;
    private String fuelType;
    private String transmissionType;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private VehicleCategory category;
}
