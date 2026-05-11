package com.rentacar.repository;

import com.rentacar.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByCustomerId(Long customerId);

    List<Reservation> findByVehicleId(Long vehicleId);

    @Query("""
        SELECT COUNT(r) > 0 FROM Reservation r
        WHERE r.vehicle.id = :vehicleId
        AND r.status NOT IN ('CANCELLED', 'COMPLETED')
        AND (
            :startDate <= r.endDate
            AND :endDate >= r.startDate
        )
    """)
    boolean existsConflictingReservation(
            @Param("vehicleId") Long vehicleId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}