# 🚀 Quick Setup Guide

## Prerequisites

- ✅ Docker Desktop installed and running
- ✅ Java 17+ installed
- ✅ Node.js 16+ installed
- ✅ Maven 3.6+ installed

## One-Command Setup

```bash
./setup.sh
```

This will:

- 🐳 Start MySQL database in Docker
- ⚡ Build and start Spring Boot backend
- 📦 Install frontend dependencies
- 🧪 Test all endpoints
- 📊 Display setup information

## Start Frontend

```bash
cd frontend
npm run dev
```

Access the application at: http://localhost:5173

## Default Users

| Username | Password | Role  |
| -------- | -------- | ----- |
| admin    | admin123 | ADMIN |
| user     | user123  | USER  |

## Stop Application

```bash
./stop.sh
```

## Manual Setup (Alternative)

### 1. Database

```bash
docker run --name mysql-busbooking \
  -e MYSQL_ROOT_PASSWORD=Ssuren78626@@ \
  -e MYSQL_DATABASE=busbookingdb \
  -p 3306:3306 \
  -d mysql:8.0
```

### 2. Backend

```bash
mvn spring-boot:run
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

## Troubleshooting

### Port 8080 in use

```bash
lsof -ti:8080 | xargs kill -9
```

### MySQL connection issues

```bash
docker restart mysql-busbooking
```

### Frontend can't connect

- Ensure backend is running on port 8080
- Check browser console for errors

## API Testing

```bash
# Test buses
curl http://localhost:8080/api/buses

# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test bookings
curl http://localhost:8080/api/bookings/admin/all
```

## Cleanup

```bash
# Stop everything
./stop.sh

# Remove Docker container
docker rm mysql-busbooking
```

---

**🎉 You're all set!** The bus booking system is now ready to use.
