package com.busbooking.dto;

import jakarta.validation.constraints.NotNull;

public class BookingDto {
    
    @NotNull(message = "Bus ID is required")
    private Long busId;
    
    @NotNull(message = "Seat number is required")
    private String seatNumber;
    
    public BookingDto() {}
    
    public BookingDto(Long busId, String seatNumber) {
        this.busId = busId;
        this.seatNumber = seatNumber;
    }
    
    // Getters and Setters
    public Long getBusId() {
        return busId;
    }
    
    public void setBusId(Long busId) {
        this.busId = busId;
    }
    
    public String getSeatNumber() {
        return seatNumber;
    }
    
    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }
} 