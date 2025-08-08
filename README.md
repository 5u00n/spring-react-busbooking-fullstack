# 🚌 Bus Booking System

A full-stack bus booking application built with Spring Boot (Backend) and React (Frontend).

## 🏗️ Architecture

- **Backend**: Spring Boot 3.2.0 with Spring Security, JWT, JPA/Hibernate
- **Frontend**: React 18 with Vite, Tailwind CSS
- **Database**: MySQL 8.0 (Docker)
- **Authentication**: JWT-based authentication

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

1. **Prerequisites**:

   - Docker Desktop installed and running
   - Java 17+ installed
   - Node.js 16+ installed
   - Maven 3.6+ installed

2. **Run the setup script**:

   ```bash
   ./setup.sh
   ```

   This script will:

   - Start MySQL database in Docker
   - Build and start the Spring Boot backend
   - Install frontend dependencies
   - Test all endpoints
   - Display setup information

### Option 2: Manual Setup

#### 1. Database Setup

```bash
# Start MySQL container
docker run --name mysql-busbooking \
  -e MYSQL_ROOT_PASSWORD=Ssuren78626@@ \
  -e MYSQL_DATABASE=busbookingdb \
  -p 3306:3306 \
  -d mysql:8.0

# Wait for MySQL to be ready (30 seconds)
sleep 30
```

#### 2. Backend Setup

```bash
# Build the project
mvn clean compile

# Start the Spring Boot application
mvn spring-boot:run
```

The backend will be available at: http://localhost:8080

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: http://localhost:5173

## 📋 Default Users

| Username | Password | Role  |
| -------- | -------- | ----- |
| admin    | admin123 | ADMIN |
| user     | user123  | USER  |

## 🔧 Configuration

### Database Configuration

- **Host**: localhost:3306
- **Database**: busbookingdb
- **Username**: root
- **Password**: Ssuren78626@@

### Backend Configuration

- **Port**: 8080
- **CORS**: Enabled for all origins
- **JWT**: Enabled (temporarily disabled for testing)

### Frontend Configuration

- **Port**: 5173 (Vite default)
- **API Base URL**: http://localhost:8080

## 📡 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Buses

- `GET /api/buses` - List all buses
- `GET /api/buses/search` - Search buses
- `GET /api/buses/{id}` - Get bus details

### Bookings

- `GET /api/bookings/user` - Get user bookings
- `GET /api/bookings/admin/all` - Get all bookings (admin)
- `POST /api/bookings` - Create booking
- `POST /api/bookings/{id}/cancel` - Cancel booking
- `POST /api/bookings/{id}/payment` - Process payment

### Admin Endpoints

- `GET /api/bookings/admin/stats` - Booking statistics
- `POST /api/bookings/admin/{id}/approve` - Approve booking
- `POST /api/bookings/admin/{id}/reject` - Reject booking

## 🗄️ Database Schema

### Users Table

- `id` (Primary Key)
- `username` (Unique)
- `password` (Encrypted)
- `email`
- `first_name`
- `last_name`
- `full_name`
- `phone`

### User Roles Table

- `user_id` (Foreign Key)
- `role` (ROLE_ADMIN, ROLE_USER)

### Buses Table

- `id` (Primary Key)
- `bus_number`
- `source`
- `destination`
- `departure_time`
- `arrival_time`
- `total_seats`
- `available_seats`
- `price`
- `bus_type`
- `operator`

### Seats Table

- `id` (Primary Key)
- `bus_id` (Foreign Key)
- `seat_number`
- `status` (AVAILABLE, BOOKED)

### Bookings Table

- `id` (Primary Key)
- `booking_number` (Unique)
- `user_id` (Foreign Key)
- `bus_id` (Foreign Key)
- `seat_id` (Foreign Key)
- `booking_date`
- `total_amount`
- `status` (CONFIRMED, CANCELLED, COMPLETED)
- `payment_status` (PENDING, PAID, FAILED, REFUNDED)

## 🛠️ Development

### Backend Development

```bash
# Run with hot reload
mvn spring-boot:run

# Run tests
mvn test

# Build JAR
mvn clean package
```

### Frontend Development

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 🔍 Troubleshooting

### Common Issues

1. **Port 8080 already in use**:

   ```bash
   lsof -ti:8080 | xargs kill -9
   ```

2. **MySQL connection failed**:

   ```bash
   # Check if Docker container is running
   docker ps

   # Restart container if needed
   docker restart mysql-busbooking
   ```

3. **Frontend can't connect to backend**:

   - Ensure backend is running on port 8080
   - Check CORS configuration
   - Verify API base URL in frontend config

4. **Authentication issues**:
   - Check JWT token expiration
   - Verify user credentials
   - Check Spring Security configuration

### Logs

- **Backend logs**: `backend.log` (created by setup script)
- **Docker logs**: `docker logs mysql-busbooking`
- **Frontend logs**: Check browser console

## 🧪 Testing

### Backend API Testing

```bash
# Test buses endpoint
curl http://localhost:8080/api/buses

# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test bookings (with token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/bookings/admin/all
```

### Frontend Testing

1. Open browser to http://localhost:5173
2. Login with admin credentials
3. Test booking functionality
4. Check admin dashboard

## 🚀 Deployment

### Backend Deployment

```bash
# Build JAR
mvn clean package

# Run JAR
java -jar target/bus-booking-system-0.0.1-SNAPSHOT.jar
```

### Frontend Deployment

```bash
cd frontend

# Build for production
npm run build

# Serve static files
npm install -g serve
serve -s dist -l 3000
```

## 📝 Features

### User Features

- ✅ User registration and login
- ✅ Browse available buses
- ✅ Search buses by route and date
- ✅ Book seats
- ✅ View booking history
- ✅ Cancel bookings
- ✅ Payment processing

### Admin Features

- ✅ View all bookings
- ✅ Approve/reject bookings
- ✅ View booking statistics
- ✅ Manage bus routes
- ✅ Monitor system status

### Technical Features

- ✅ JWT Authentication
- ✅ Role-based access control
- ✅ CORS configuration
- ✅ Database persistence
- ✅ RESTful API
- ✅ Responsive UI
- ✅ Real-time updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Review the logs
3. Ensure all prerequisites are installed
4. Verify Docker is running
5. Check port availability

For additional help, please open an issue on GitHub.
