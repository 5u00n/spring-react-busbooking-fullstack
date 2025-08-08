package com.busbooking.config;

import com.busbooking.entity.Bus;
import com.busbooking.entity.User;
import com.busbooking.service.BusService;
import com.busbooking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private BusService busService;
    
    @Override
    public void run(String... args) throws Exception {
        // Create sample users
        createSampleUsers();
        
        // Create sample buses with Indian routes
        createSampleBuses();
    }
    
    private void createSampleUsers() {
        // Check if admin user exists
        if (!userService.findByUsername("admin").isPresent()) {
            // Create admin user
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setEmail("admin@busbooking.com");
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setFullName("System Administrator");
            admin.setPhone("9876543210");
            admin.setRoles(Arrays.asList("ROLE_ADMIN"));
            userService.registerUser(admin);
        }
        
        // Check if regular user exists
        if (!userService.findByUsername("user").isPresent()) {
            // Create regular user
            User user = new User();
            user.setUsername("user");
            user.setPassword("user123");
            user.setEmail("user@example.com");
            user.setFirstName("John");
            user.setLastName("Doe");
            user.setFullName("John Doe");
            user.setPhone("9876543211");
            user.setRoles(Arrays.asList("ROLE_USER"));
            userService.registerUser(user);
        }
    }
    
    private void createSampleBuses() {
        // Check if buses already exist
        if (busService.getAllBuses().isEmpty()) {
            // Mumbai to Delhi
            Bus bus1 = new Bus();
            bus1.setBusNumber("MB001");
            bus1.setSource("Mumbai");
            bus1.setDestination("Delhi");
            bus1.setDepartureTime(LocalDateTime.now().plusDays(1).withHour(8).withMinute(0));
            bus1.setArrivalTime(LocalDateTime.now().plusDays(2).withHour(6).withMinute(0));
            bus1.setTotalSeats(40);
            bus1.setAvailableSeats(40);
            bus1.setPrice(new BigDecimal("2500.00"));
            bus1.setBusType("AC Sleeper");
            bus1.setOperator("RedBus Express");
            busService.addBus(bus1);
        
        // Delhi to Bangalore
        Bus bus2 = new Bus();
        bus2.setBusNumber("DB002");
        bus2.setSource("Delhi");
        bus2.setDestination("Bangalore");
        bus2.setDepartureTime(LocalDateTime.now().plusDays(1).withHour(10).withMinute(30));
        bus2.setArrivalTime(LocalDateTime.now().plusDays(2).withHour(8).withMinute(30));
        bus2.setTotalSeats(35);
        bus2.setAvailableSeats(35);
        bus2.setPrice(new BigDecimal("3200.00"));
        bus2.setBusType("AC Semi-Sleeper");
        bus2.setOperator("Karnataka Express");
        busService.addBus(bus2);
        
        // Bangalore to Chennai
        Bus bus3 = new Bus();
        bus3.setBusNumber("BC003");
        bus3.setSource("Bangalore");
        bus3.setDestination("Chennai");
        bus3.setDepartureTime(LocalDateTime.now().plusDays(1).withHour(14).withMinute(0));
        bus3.setArrivalTime(LocalDateTime.now().plusDays(1).withHour(22).withMinute(0));
        bus3.setTotalSeats(45);
        bus3.setAvailableSeats(45);
        bus3.setPrice(new BigDecimal("1200.00"));
        bus3.setBusType("Non-AC Seater");
        bus3.setOperator("Tamil Nadu Transport");
        busService.addBus(bus3);
        
        // Chennai to Hyderabad
        Bus bus4 = new Bus();
        bus4.setBusNumber("CH004");
        bus4.setSource("Chennai");
        bus4.setDestination("Hyderabad");
        bus4.setDepartureTime(LocalDateTime.now().plusDays(1).withHour(16).withMinute(30));
        bus4.setArrivalTime(LocalDateTime.now().plusDays(2).withHour(2).withMinute(30));
        bus4.setTotalSeats(38);
        bus4.setAvailableSeats(38);
        bus4.setPrice(new BigDecimal("1800.00"));
        bus4.setBusType("AC Sleeper");
        bus4.setOperator("Telangana Express");
        busService.addBus(bus4);
        
        // Hyderabad to Pune
        Bus bus5 = new Bus();
        bus5.setBusNumber("HP005");
        bus5.setSource("Hyderabad");
        bus5.setDestination("Pune");
        bus5.setDepartureTime(LocalDateTime.now().plusDays(1).withHour(20).withMinute(0));
        bus5.setArrivalTime(LocalDateTime.now().plusDays(2).withHour(8).withMinute(0));
        bus5.setTotalSeats(42);
        bus5.setAvailableSeats(42);
        bus5.setPrice(new BigDecimal("2200.00"));
        bus5.setBusType("AC Semi-Sleeper");
        bus5.setOperator("Maharashtra Transport");
        busService.addBus(bus5);
        
        // Pune to Mumbai
        Bus bus6 = new Bus();
        bus6.setBusNumber("PM006");
        bus6.setSource("Pune");
        bus6.setDestination("Mumbai");
        bus6.setDepartureTime(LocalDateTime.now().plusDays(1).withHour(7).withMinute(0));
        bus6.setArrivalTime(LocalDateTime.now().plusDays(1).withHour(11).withMinute(0));
        bus6.setTotalSeats(50);
        bus6.setAvailableSeats(50);
        bus6.setPrice(new BigDecimal("800.00"));
        bus6.setBusType("Non-AC Seater");
        bus6.setOperator("MSRTC");
        busService.addBus(bus6);
        
        // Kolkata to Delhi
        Bus bus7 = new Bus();
        bus7.setBusNumber("KD007");
        bus7.setSource("Kolkata");
        bus7.setDestination("Delhi");
        bus7.setDepartureTime(LocalDateTime.now().plusDays(1).withHour(9).withMinute(0));
        bus7.setArrivalTime(LocalDateTime.now().plusDays(2).withHour(7).withMinute(0));
        bus7.setTotalSeats(36);
        bus7.setAvailableSeats(36);
        bus7.setPrice(new BigDecimal("2800.00"));
        bus7.setBusType("AC Sleeper");
        bus7.setOperator("West Bengal Transport");
        busService.addBus(bus7);
        
        // Ahmedabad to Mumbai
        Bus bus8 = new Bus();
        bus8.setBusNumber("AM008");
        bus8.setSource("Ahmedabad");
        bus8.setDestination("Mumbai");
        bus8.setDepartureTime(LocalDateTime.now().plusDays(1).withHour(12).withMinute(0));
        bus8.setArrivalTime(LocalDateTime.now().plusDays(1).withHour(20).withMinute(0));
        bus8.setTotalSeats(44);
        bus8.setAvailableSeats(44);
        bus8.setPrice(new BigDecimal("1500.00"));
        bus8.setBusType("AC Seater");
        bus8.setOperator("Gujarat Transport");
        busService.addBus(bus8);
        }
    }
} 