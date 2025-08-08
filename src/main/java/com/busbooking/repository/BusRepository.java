package com.busbooking.repository;

import com.busbooking.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    
    List<Bus> findBySourceAndDestination(String source, String destination);
    
    List<Bus> findBySourceAndDestinationAndDepartureTimeBetween(
        String source, String destination, LocalDateTime startTime, LocalDateTime endTime);
    
    @Query("SELECT b FROM Bus b WHERE b.source = :source AND b.destination = :destination AND DATE(b.departureTime) = :date")
    List<Bus> findBySourceAndDestinationAndDate(@Param("source") String source, 
                                               @Param("destination") String destination, 
                                               @Param("date") String date);
} 