package com.busbooking.service;

import com.busbooking.entity.Bus;
import com.busbooking.entity.Seat;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class BusService {
    
    @Autowired
    private BusRepository busRepository;
    
    @Autowired
    private SeatRepository seatRepository;
    
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }
    
    public Optional<Bus> getBusById(Long id) {
        return busRepository.findById(id);
    }
    
    public List<Bus> searchBuses(String source, String destination, String date) {
        if (date != null && !date.isEmpty()) {
            LocalDate searchDate = LocalDate.parse(date);
            return busRepository.findBySourceAndDestinationAndDepartureTimeBetween(
                source, destination, 
                searchDate.atStartOfDay(), 
                searchDate.atTime(23, 59, 59)
            );
        } else {
            return busRepository.findBySourceAndDestination(source, destination);
        }
    }
    
    public Bus addBus(Bus bus) {
        // Initialize seats for the bus
        bus.setAvailableSeats(bus.getTotalSeats());
        Bus savedBus = busRepository.save(bus);
        
        // Create seats for the bus
        for (int i = 1; i <= bus.getTotalSeats(); i++) {
            Seat seat = new Seat();
            seat.setBus(savedBus);
            seat.setSeatNumber("A" + i);
            seat.setStatus(Seat.SeatStatus.AVAILABLE);
            seatRepository.save(seat);
        }
        
        return savedBus;
    }
    
    public Bus updateBus(Bus bus) {
        return busRepository.save(bus);
    }
    
    public void deleteBus(Long id) {
        busRepository.deleteById(id);
    }
    
    public List<Seat> getAllSeats(Long busId) {
        return seatRepository.findByBusId(busId);
    }
    
    public List<Seat> getAvailableSeats(Long busId) {
        return seatRepository.findByBusIdAndStatus(busId, Seat.SeatStatus.AVAILABLE);
    }
    
    public Bus createBus(Bus bus) {
        return addBus(bus);
    }
    
    public Optional<Seat> getSeatByNumber(Long busId, String seatNumber) {
        return seatRepository.findByBusIdAndSeatNumber(busId, seatNumber);
    }
    
    public Seat updateSeatStatus(Long seatId, Seat.SeatStatus status) {
        Optional<Seat> seatOpt = seatRepository.findById(seatId);
        if (seatOpt.isPresent()) {
            Seat seat = seatOpt.get();
            seat.setStatus(status);
            return seatRepository.save(seat);
        }
        throw new RuntimeException("Seat not found");
    }
} 