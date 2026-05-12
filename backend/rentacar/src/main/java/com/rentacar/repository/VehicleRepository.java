package com.rentacar.repository;

import com.rentacar.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    @Query("""
    SELECT v FROM Vehicle v
    WHERE v.status NOT IN ('MAINTENANCE', 'BROKEN')

    AND v.id NOT IN (
        SELECT r.vehicle.id FROM Reservation r
        WHERE r.status NOT IN ('CANCELLED', 'COMPLETED')
        AND r.startDate < :endDate
        AND r.endDate > :startDate
    )

    AND v.id NOT IN (
        SELECT m.vehicle.id FROM Maintenance m
        WHERE m.startDate < :endDate
        AND m.endDate > :startDate
    )
""")
    List<Vehicle> findAvailableVehicles(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}