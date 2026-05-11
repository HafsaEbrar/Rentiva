package com.rentacar.service;

import com.rentacar.entity.Vehicle;
import com.rentacar.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public List<Vehicle> getAvailableVehicles(LocalDate startDate, LocalDate endDate) {
        return vehicleRepository.findAvailableVehicles(startDate, endDate);
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Araç bulunamadı"));
    }

    public Vehicle saveVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Vehicle updateVehicle(Long id, Vehicle updated) {

        Vehicle existing = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Araç bulunamadı"));

        if (updated.getPlateNo() != null)
            existing.setPlateNo(updated.getPlateNo());

        if (updated.getYear() != null)
            existing.setYear(updated.getYear());

        if (updated.getDailyPrice() != null)
            existing.setDailyPrice(updated.getDailyPrice());

        if (updated.getStatus() != null)
            existing.setStatus(updated.getStatus());

        if (updated.getDescription() != null)
            existing.setDescription(updated.getDescription());

        if (updated.getImageUrl() != null)
            existing.setImageUrl(updated.getImageUrl());

        if (updated.getHasAirConditioning() != null)
            existing.setHasAirConditioning(updated.getHasAirConditioning());

        if (updated.getHasChildSeat() != null)
            existing.setHasChildSeat(updated.getHasChildSeat());

        if (updated.getHasAppleCarplay() != null)
            existing.setHasAppleCarplay(updated.getHasAppleCarplay());

        if (updated.getHasRearViewCamera() != null)
            existing.setHasRearViewCamera(updated.getHasRearViewCamera());

        if (updated.getHasBluetooth() != null)
            existing.setHasBluetooth(updated.getHasBluetooth());

        if (updated.getHasNavigation() != null)
            existing.setHasNavigation(updated.getHasNavigation());

        if (updated.getAirbagCount() != null)
            existing.setAirbagCount(updated.getAirbagCount());

        return vehicleRepository.save(existing);
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}