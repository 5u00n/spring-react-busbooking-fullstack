package com.busbooking.controller;

import com.busbooking.dto.BookingDto;
import com.busbooking.entity.Booking;
import com.busbooking.entity.User;
import com.busbooking.service.BookingService;
import com.busbooking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingDto bookingDto) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            // Get user ID from the authenticated user
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Long userId = user.getId();
            
            Booking booking = bookingService.createBooking(userId, bookingDto.getBusId(), bookingDto.getSeatNumber());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Booking created successfully");
            response.put("bookingNumber", booking.getBookingNumber());
            response.put("totalAmount", booking.getTotalAmount());
            response.put("status", booking.getStatus());
            response.put("paymentStatus", booking.getPaymentStatus());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/user")
    public ResponseEntity<List<Map<String, Object>>> getUserBookings() {
        try {
            // For now, return all bookings since authentication is disabled
            List<Booking> bookings = bookingService.getAllBookings();
            List<Map<String, Object>> bookingResponses = new ArrayList<>();
            
            for (Booking booking : bookings) {
                Map<String, Object> bookingResponse = new HashMap<>();
                bookingResponse.put("id", booking.getId());
                bookingResponse.put("bookingNumber", booking.getBookingNumber());
                bookingResponse.put("bookingDate", booking.getBookingDate());
                bookingResponse.put("totalAmount", booking.getTotalAmount());
                bookingResponse.put("status", booking.getStatus());
                bookingResponse.put("paymentStatus", booking.getPaymentStatus());
                
                // Add bus info if available
                if (booking.getBus() != null) {
                    Map<String, Object> busInfo = new HashMap<>();
                    busInfo.put("id", booking.getBus().getId());
                    busInfo.put("busNumber", booking.getBus().getBusNumber());
                    busInfo.put("source", booking.getBus().getSource());
                    busInfo.put("destination", booking.getBus().getDestination());
                    busInfo.put("departureTime", booking.getBus().getDepartureTime());
                    busInfo.put("arrivalTime", booking.getBus().getArrivalTime());
                    busInfo.put("price", booking.getBus().getPrice());
                    bookingResponse.put("bus", busInfo);
                }
                
                // Add seat info if available
                if (booking.getSeat() != null) {
                    Map<String, Object> seatInfo = new HashMap<>();
                    seatInfo.put("id", booking.getSeat().getId());
                    seatInfo.put("seatNumber", booking.getSeat().getSeatNumber());
                    seatInfo.put("status", booking.getSeat().getStatus());
                    bookingResponse.put("seat", seatInfo);
                }
                
                bookingResponses.add(bookingResponse);
            }
            
            return ResponseEntity.ok(bookingResponses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{bookingNumber}")
    public ResponseEntity<Booking> getBookingByNumber(@PathVariable String bookingNumber) {
        return bookingService.getBookingByNumber(bookingNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/{bookingNumber}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable String bookingNumber) {
        try {
            Booking booking = bookingService.cancelBooking(bookingNumber);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Booking cancelled successfully");
            response.put("bookingNumber", booking.getBookingNumber());
            response.put("status", booking.getStatus());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/{bookingNumber}/payment")
    public ResponseEntity<?> processPayment(@PathVariable String bookingNumber) {
        try {
            Booking booking = bookingService.processPayment(bookingNumber);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Payment processed successfully");
            response.put("bookingNumber", booking.getBookingNumber());
            response.put("paymentStatus", booking.getPaymentStatus());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Admin endpoints
    @GetMapping("/admin/all")
    public ResponseEntity<List<Map<String, Object>>> getAllBookings() {
        try {
            List<Booking> bookings = bookingService.getAllBookings();
            List<Map<String, Object>> bookingResponses = new ArrayList<>();
            
            for (Booking booking : bookings) {
                Map<String, Object> bookingResponse = new HashMap<>();
                bookingResponse.put("id", booking.getId());
                bookingResponse.put("bookingNumber", booking.getBookingNumber());
                bookingResponse.put("bookingDate", booking.getBookingDate());
                bookingResponse.put("totalAmount", booking.getTotalAmount());
                bookingResponse.put("status", booking.getStatus());
                bookingResponse.put("paymentStatus", booking.getPaymentStatus());
                
                // Add user info if available
                if (booking.getUser() != null) {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("id", booking.getUser().getId());
                    userInfo.put("username", booking.getUser().getUsername());
                    userInfo.put("fullName", booking.getUser().getFullName());
                    bookingResponse.put("user", userInfo);
                }
                
                // Add bus info if available
                if (booking.getBus() != null) {
                    Map<String, Object> busInfo = new HashMap<>();
                    busInfo.put("id", booking.getBus().getId());
                    busInfo.put("busNumber", booking.getBus().getBusNumber());
                    busInfo.put("source", booking.getBus().getSource());
                    busInfo.put("destination", booking.getBus().getDestination());
                    busInfo.put("departureTime", booking.getBus().getDepartureTime());
                    busInfo.put("arrivalTime", booking.getBus().getArrivalTime());
                    busInfo.put("price", booking.getBus().getPrice());
                    bookingResponse.put("bus", busInfo);
                }
                
                // Add seat info if available
                if (booking.getSeat() != null) {
                    Map<String, Object> seatInfo = new HashMap<>();
                    seatInfo.put("id", booking.getSeat().getId());
                    seatInfo.put("seatNumber", booking.getSeat().getSeatNumber());
                    seatInfo.put("status", booking.getSeat().getStatus());
                    bookingResponse.put("seat", seatInfo);
                }
                
                bookingResponses.add(bookingResponse);
            }
            
            return ResponseEntity.ok(bookingResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Object>> getBookingStats() {
        try {
            Map<String, Object> stats = bookingService.getBookingStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/admin/{bookingNumber}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable String bookingNumber) {
        try {
            Booking booking = bookingService.approveBooking(bookingNumber);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Booking approved successfully");
            response.put("bookingNumber", booking.getBookingNumber());
            response.put("status", booking.getStatus());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/admin/{bookingNumber}/reject")
    public ResponseEntity<?> rejectBooking(@PathVariable String bookingNumber) {
        try {
            Booking booking = bookingService.rejectBooking(bookingNumber);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Booking rejected successfully");
            response.put("bookingNumber", booking.getBookingNumber());
            response.put("status", booking.getStatus());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 