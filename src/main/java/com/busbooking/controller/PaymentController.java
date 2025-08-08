package com.busbooking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processPayment(@RequestBody Map<String, Object> paymentRequest) {
        Map<String, Object> response = new HashMap<>();
        
        // Simulate payment processing
        try {
            Thread.sleep(2000); // Simulate processing time
            
            // Simulate payment success/failure (90% success rate)
            Random random = new Random();
            boolean paymentSuccess = random.nextDouble() < 0.9;
            
            if (paymentSuccess) {
                response.put("success", true);
                response.put("transactionId", "TXN" + System.currentTimeMillis());
                response.put("message", "Payment processed successfully");
                response.put("amount", paymentRequest.get("amount"));
                response.put("currency", "INR");
                response.put("paymentMethod", paymentRequest.get("paymentMethod"));
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Payment failed. Please try again.");
                response.put("errorCode", "PAYMENT_DECLINED");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (InterruptedException e) {
            response.put("success", false);
            response.put("message", "Payment processing error");
            response.put("errorCode", "PROCESSING_ERROR");
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, Object> verificationRequest) {
        Map<String, Object> response = new HashMap<>();
        
        String transactionId = (String) verificationRequest.get("transactionId");
        
        if (transactionId != null && transactionId.startsWith("TXN")) {
            response.put("success", true);
            response.put("verified", true);
            response.put("transactionId", transactionId);
            response.put("message", "Payment verified successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("verified", false);
            response.put("message", "Invalid transaction ID");
            return ResponseEntity.badRequest().body(response);
        }
    }
} 