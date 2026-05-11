package com.rentacar.service;

import com.rentacar.entity.Reservation;
import com.rentacar.entity.ReservationStatus;
import com.rentacar.repository.MaintenanceRepository;
import com.rentacar.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final MaintenanceRepository maintenanceRepository;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rezervasyon bulunamadı"));
    }

    public Reservation saveReservation(Reservation reservation) {

        Long vehicleId = reservation.getVehicle().getId();

        String vehicleStatus = reservation.getVehicle().getStatus();

        if (vehicleStatus.equals("MAINTENANCE")) {
            throw new RuntimeException("Araç bakımda olduğu için rezerve edilemez.");
        }

        if (vehicleStatus.equals("BROKEN")) {
            throw new RuntimeException("Araç arızalı olduğu için rezerve edilemez.");
        }

        if (reservation.getStartDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Geçmiş tarihe rezervasyon yapılamaz.");
        }

        if (reservation.getEndDate().isBefore(reservation.getStartDate())) {
            throw new RuntimeException("Bitiş tarihi başlangıç tarihinden önce olamaz.");
        }

        boolean hasConflict = reservationRepository.existsConflictingReservation(
                vehicleId,
                reservation.getStartDate(),
                reservation.getEndDate()
        );

        if (hasConflict) {
            throw new RuntimeException("Bu araç seçilen tarihlerde müsait değil.");
        }

        boolean inMaintenance = maintenanceRepository.existsActiveMaintenanceForVehicle(
                vehicleId,
                reservation.getStartDate(),
                reservation.getEndDate()
        );

        if (inMaintenance) {
            throw new RuntimeException("Bu araç belirtilen tarihlerde bakımda.");
        }

        reservation.setStatus(ReservationStatus.ACTIVE);

        return reservationRepository.save(reservation);
    }

    public Reservation cancelReservation(Long id) {
        Reservation reservation = getReservationById(id);
        reservation.setStatus(ReservationStatus.CANCELLED);
        return reservationRepository.save(reservation);
    }

    public Reservation completeReservation(Long id) {
        Reservation reservation = getReservationById(id);
        reservation.setStatus(ReservationStatus.COMPLETED);
        return reservationRepository.save(reservation);
    }

    public void deleteReservation(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Rezervasyon bulunamadı");
        }
        reservationRepository.deleteById(id);
    }
}