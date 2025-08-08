package com.busbooking.repository;

import com.busbooking.entity.Seat;
import com.busbooking.entity.Seat.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    
    List<Seat> findByBusIdAndStatus(Long busId, SeatStatus status);
    
    Optional<Seat> findByBusIdAndSeatNumber(Long busId, String seatNumber);
    
    List<Seat> findByBusId(Long busId);
} 