package com.rentacar.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    private LocalDate createdAt;

    @ManyToMany
    @JoinTable(
        name = "reservation_extras",
        joinColumns = @JoinColumn(name = "reservation_id"),
        inverseJoinColumns = @JoinColumn(name = "extra_id")
    )
    private List<Extra> extras;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDate.now();
    }
}