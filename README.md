# Bus Booking System

A complete bus booking system built with Spring Boot backend and React frontend, featuring user authentication, bus search, seat booking, and payment processing.

## Features

### Backend (Spring Boot)

- **User Authentication**: JWT-based authentication with login/signup
- **Bus Management**: CRUD operations for buses and routes
- **Seat Management**: Real-time seat availability tracking
- **Booking System**: Complete booking workflow with confirmation
- **Payment Processing**: Simulated payment processing
- **Database**: H2 in-memory database with automatic table creation
- **Security**: Spring Security with JWT tokens
- **CORS**: Configured for frontend communication

### Frontend (React + Vite)

- **Modern UI**: Beautiful interface with Tailwind CSS
- **User Authentication**: Login/register pages with form validation
- **Bus Search**: Advanced search with filters
- **Seat Selection**: Interactive seat map with availability
- **Booking Management**: View and manage bookings
- **Payment Integration**: Process payments for bookings
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

### Backend

- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- H2 Database
- JWT Authentication
- Maven

### Frontend

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React Icons
- React Hot Toast

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- npm or yarn

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd spring-test
```

### 2. Start the Backend

Navigate to the project root and run:

```bash
# Using Maven wrapper
./mvnw spring-boot:run

# Or using Maven directly
mvn spring-boot:run
```

The Spring Boot application will start on `http://localhost:8080`

### 3. Start the Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The React application will start on `http://localhost:5173`

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **H2 Database Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:busbookingdb`
  - Username: `sa`
  - Password: `password`

## Demo Credentials

The application comes with pre-loaded sample data:

### Users

- **Admin**: `admin` / `admin123`
- **User 1**: `john` / `password123`
- **User 2**: `jane` / `password123`

### Sample Buses

- New York → Boston
- Boston → New York
- Chicago → Detroit
- Los Angeles → San Francisco
- Miami → Orlando

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Buses

- `GET /api/buses` - Get all buses
- `GET /api/buses/{id}` - Get bus by ID
- `GET /api/buses/search` - Search buses
- `GET /api/buses/{id}/seats` - Get bus seats
- `POST /api/buses` - Create new bus

### Bookings

- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user bookings
- `GET /api/bookings/{number}` - Get booking by number
- `POST /api/bookings/{number}/cancel` - Cancel booking
- `POST /api/bookings/{number}/payment` - Process payment

## Project Structure

```
spring-test/
├── src/main/java/com/busbooking/
│   ├── BusBookingApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   └── DataInitializer.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── BusController.java
│   │   └── BookingController.java
│   ├── dto/
│   │   ├── LoginDto.java
│   │   ├── UserRegistrationDto.java
│   │   └── BookingDto.java
│   ├── entity/
│   │   ├── User.java
│   │   ├── Bus.java
│   │   ├── Seat.java
│   │   └── Booking.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── BusRepository.java
│   │   ├── SeatRepository.java
│   │   └── BookingRepository.java
│   ├── service/
│   │   ├── UserService.java
│   │   ├── BusService.java
│   │   └── BookingService.java
│   └── security/
│       ├── JwtTokenProvider.java
│       └── JwtAuthenticationFilter.java
├── src/main/resources/
│   └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── BusSearch.jsx
│   │   │   ├── BusDetails.jsx
│   │   │   └── MyBookings.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── pom.xml
```

## Features in Detail

### User Authentication

- Secure JWT-based authentication
- User registration with validation
- Password encryption with BCrypt
- Role-based access control

### Bus Search & Booking

- Search buses by route and date
- Real-time seat availability
- Interactive seat selection
- Booking confirmation with unique numbers

### Payment System

- Simulated payment processing
- Payment status tracking
- Booking cancellation support

### Database

- Automatic table creation
- Sample data initialization
- H2 in-memory database for development

## Development

### Backend Development

- The application uses H2 in-memory database
- Tables are created automatically on startup
- Sample data is loaded via `DataInitializer`
- JWT tokens are used for authentication

### Frontend Development

- React with Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management

## Deployment

### Backend Deployment

1. Build the JAR file: `mvn clean package`
2. Run the JAR: `java -jar target/bus-booking-system-0.0.1-SNAPSHOT.jar`

### Frontend Deployment

1. Build the production files: `npm run build`
2. Deploy the `dist` folder to your web server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Feel free to use and modify as needed.

## Support

For any issues or questions, please create an issue in the repository.
