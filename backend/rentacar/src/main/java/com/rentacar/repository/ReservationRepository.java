package com.rentacar.repository;

import com.rentacar.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // 🔹 kullanıcıya göre rezervasyonlar
    List<Reservation> findByCustomerId(Long customerId);

    // 🔹 araca göre rezervasyonlar
    List<Reservation> findByVehicleId(Long vehicleId);
}