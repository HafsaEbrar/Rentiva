package com.rentacar.repository;

import com.rentacar.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {

    @Query("""
        SELECT COUNT(m) > 0 FROM Maintenance m
        WHERE m.vehicle.id = :vehicleId
        AND m.endDate > :startDate
        AND m.startDate < :endDate
    """)
    boolean existsActiveMaintenanceForVehicle(
        @Param("vehicleId") Long vehicleId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}