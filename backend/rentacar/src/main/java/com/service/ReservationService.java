package com.rentacar.service;

import com.rentacar.entity.Reservation;
import com.rentacar.entity.ReservationStatus;
import com.rentacar.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;

    // 🔹 TÜMÜ
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // 🔹 ID
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rezervasyon bulunamadı"));
    }

    // 🔹 CREATE
    public Reservation saveReservation(Reservation reservation) {

        // 🔥 status otomatik set
        reservation.setStatus(ReservationStatus.ACTIVE);

        return reservationRepository.save(reservation);
    }

    // 🔹 DELETE
    public void deleteReservation(Long id) {

        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Rezervasyon bulunamadı");
        }

        reservationRepository.deleteById(id);
    }
}