package com.rentacar.controller;

import com.rentacar.entity.Reservation;
import com.rentacar.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/{id}")
    public Reservation getReservationById(@PathVariable Long id) {
        return reservationService.getReservationById(id);
    }

    // 🔥 CREATE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Reservation createReservation(@RequestBody Reservation reservation) {
        return reservationService.saveReservation(reservation);
    }

    // 🔥 DELETE
    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
    }

    // 🔥 CUSTOMER'A GÖRE
    @GetMapping("/customer/{customerId}")
    public List<Reservation> getByCustomer(@PathVariable Long customerId) {
        return reservationService.getAllReservations()
                .stream()
                .filter(r -> r.getCustomer().getId().equals(customerId))
                .toList();
    }
}