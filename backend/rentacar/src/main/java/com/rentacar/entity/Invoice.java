package com.rentacar.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @Column(unique = true, nullable = false)
    private String invoiceNo;

    private LocalDate invoiceDate;
    private Double invoiceAmount;
    private String invoiceStatus;
}