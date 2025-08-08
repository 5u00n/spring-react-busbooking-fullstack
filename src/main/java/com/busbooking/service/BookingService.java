package com.busbooking.service;

import com.busbooking.entity.Booking;
import com.busbooking.entity.Bus;
import com.busbooking.entity.Seat;
import com.busbooking.entity.User;
import com.busbooking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private BusService busService;
    
    @Autowired
    private UserService userService;
    
    public Booking createBooking(Long userId, Long busId, String seatNumber) {
        // Get user
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get bus
        Bus bus = busService.getBusById(busId)
                .orElseThrow(() -> new RuntimeException("Bus not found"));
        
        // Get seat
        Seat seat = busService.getSeatByNumber(busId, seatNumber)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
        
        // Check if seat is available
        if (seat.getStatus() != Seat.SeatStatus.AVAILABLE) {
            throw new RuntimeException("Seat is not available");
        }
        
        // Create booking
        String bookingNumber = generateBookingNumber();
        Booking booking = new Booking(bookingNumber, user, bus, seat, LocalDateTime.now(), bus.getPrice());
        
        // Update seat status
        seat.setStatus(Seat.SeatStatus.BOOKED);
        seat.setBooking(booking);
        
        // Save booking
        return bookingRepository.save(booking);
    }
    
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
    
    public Optional<Booking> getBookingByNumber(String bookingNumber) {
        return bookingRepository.findByBookingNumber(bookingNumber);
    }
    
    public Booking cancelBooking(String bookingNumber) {
        Booking booking = getBookingByNumber(bookingNumber)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.getSeat().setStatus(Seat.SeatStatus.AVAILABLE);
        booking.getSeat().setBooking(null);
        
        return bookingRepository.save(booking);
    }
    
    public Booking processPayment(String bookingNumber) {
        Booking booking = getBookingByNumber(bookingNumber)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // Simulate payment processing
        booking.setPaymentStatus(Booking.PaymentStatus.PAID);
        
        return bookingRepository.save(booking);
    }
    
    public BigDecimal calculateTotalAmount(Bus bus, int numberOfSeats) {
        return bus.getPrice().multiply(BigDecimal.valueOf(numberOfSeats));
    }
    
    private String generateBookingNumber() {
        return "BK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    // Admin methods
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public Map<String, Object> getBookingStats() {
        List<Booking> allBookings = bookingRepository.findAll();
        
        long totalBookings = allBookings.size();
        long confirmedBookings = allBookings.stream()
                .filter(booking -> booking.getStatus() == Booking.BookingStatus.CONFIRMED)
                .count();
        long cancelledBookings = allBookings.stream()
                .filter(booking -> booking.getStatus() == Booking.BookingStatus.CANCELLED)
                .count();
        long paidBookings = allBookings.stream()
                .filter(booking -> booking.getPaymentStatus() == Booking.PaymentStatus.PAID)
                .count();
        long pendingPayments = allBookings.stream()
                .filter(booking -> booking.getPaymentStatus() == Booking.PaymentStatus.PENDING)
                .count();
        
        BigDecimal totalRevenue = allBookings.stream()
                .filter(booking -> booking.getPaymentStatus() == Booking.PaymentStatus.PAID)
                .map(Booking::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBookings", totalBookings);
        stats.put("confirmedBookings", confirmedBookings);
        stats.put("cancelledBookings", cancelledBookings);
        stats.put("paidBookings", paidBookings);
        stats.put("pendingPayments", pendingPayments);
        stats.put("totalRevenue", totalRevenue);
        
        return stats;
    }
    
    public Booking approveBooking(String bookingNumber) {
        Booking booking = getBookingByNumber(bookingNumber)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }
    
    public Booking rejectBooking(String bookingNumber) {
        Booking booking = getBookingByNumber(bookingNumber)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.getSeat().setStatus(Seat.SeatStatus.AVAILABLE);
        booking.getSeat().setBooking(null);
        
        return bookingRepository.save(booking);
    }
} 