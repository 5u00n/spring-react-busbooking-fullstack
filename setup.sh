#!/bin/bash

# Bus Booking System Setup Script
# This script sets up the complete bus booking system

echo "🚌 Bus Booking System Setup"
echo "============================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    print_status "Checking Docker status..."
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Setup MySQL Database
setup_database() {
    print_status "Setting up MySQL database..."
    
    # Check if MySQL container is running
    if docker ps | grep -q "mysql"; then
        print_warning "MySQL container is already running"
    else
        print_status "Starting MySQL container..."
        docker run --name mysql-busbooking \
            -e MYSQL_ROOT_PASSWORD=Ssuren78626@@ \
            -e MYSQL_DATABASE=busbookingdb \
            -p 3306:3306 \
            -d mysql:8.0
        
        # Wait for MySQL to be ready
        print_status "Waiting for MySQL to be ready..."
        sleep 30
        
        # Test connection
        if docker exec mysql-busbooking mysql -u root -p'Ssuren78626@@' -e "SELECT 1;" > /dev/null 2>&1; then
            print_success "MySQL database is ready"
        else
            print_error "Failed to connect to MySQL. Please check Docker logs."
            exit 1
        fi
    fi
}

# Build and start Spring Boot application
start_backend() {
    print_status "Building and starting Spring Boot application..."
    
    # Kill any existing processes on port 8080
    if lsof -ti:8080 > /dev/null 2>&1; then
        print_warning "Port 8080 is in use. Killing existing processes..."
        lsof -ti:8080 | xargs kill -9
        sleep 2
    fi
    
    # Clean and compile
    print_status "Cleaning and compiling project..."
    mvn clean compile
    
    if [ $? -eq 0 ]; then
        print_success "Project compiled successfully"
    else
        print_error "Compilation failed"
        exit 1
    fi
    
    # Start the application in background
    print_status "Starting Spring Boot application..."
    nohup mvn spring-boot:run > backend.log 2>&1 &
    BACKEND_PID=$!
    
    # Wait for backend to start
    print_status "Waiting for backend to start..."
    for i in {1..60}; do
        if curl -s http://localhost:8080/api/buses > /dev/null 2>&1; then
            print_success "Backend is running on http://localhost:8080"
            break
        fi
        if [ $i -eq 60 ]; then
            print_error "Backend failed to start. Check backend.log for details."
            exit 1
        fi
        sleep 2
    done
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    if [ ! -d "frontend" ]; then
        print_error "Frontend directory not found"
        exit 1
    fi
    
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
        
        if [ $? -eq 0 ]; then
            print_success "Frontend dependencies installed"
        else
            print_error "Failed to install frontend dependencies"
            exit 1
        fi
    else
        print_warning "Frontend dependencies already installed"
    fi
    
    cd ..
}

# Test the application
test_application() {
    print_status "Testing application endpoints..."
    
    # Test buses endpoint
    if curl -s http://localhost:8080/api/buses > /dev/null 2>&1; then
        print_success "Buses endpoint is working"
    else
        print_error "Buses endpoint failed"
    fi
    
    # Test login endpoint
    if curl -s -X POST http://localhost:8080/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"username":"admin","password":"admin123"}' > /dev/null 2>&1; then
        print_success "Login endpoint is working"
    else
        print_error "Login endpoint failed"
    fi
    
    # Test bookings endpoint
    if curl -s http://localhost:8080/api/bookings/admin/all > /dev/null 2>&1; then
        print_success "Bookings endpoint is working"
    else
        print_error "Bookings endpoint failed"
    fi
}

# Display final information
show_final_info() {
    echo ""
    echo "🎉 Setup Complete!"
    echo "=================="
    echo ""
    echo "📊 Backend Status:"
    echo "   - URL: http://localhost:8080"
    echo "   - Logs: backend.log"
    echo "   - PID: $BACKEND_PID"
    echo ""
    echo "🔧 Database:"
    echo "   - MySQL running in Docker"
    echo "   - Database: busbookingdb"
    echo "   - Port: 3306"
    echo ""
    echo "👤 Default Users:"
    echo "   - Admin: admin / admin123"
    echo "   - User: user / user123"
    echo ""
    echo "🚀 To start the frontend:"
    echo "   cd frontend"
    echo "   npm run dev"
    echo ""
    echo "📋 Available Endpoints:"
    echo "   - GET  /api/buses - List all buses"
    echo "   - POST /api/auth/login - User login"
    echo "   - GET  /api/bookings/admin/all - All bookings (admin)"
    echo "   - GET  /api/bookings/user - User bookings"
    echo ""
    echo "🛑 To stop the backend:"
    echo "   kill $BACKEND_PID"
    echo ""
    echo "🗑️  To clean up Docker:"
    echo "   docker stop mysql-busbooking"
    echo "   docker rm mysql-busbooking"
}

# Main execution
main() {
    echo "Starting setup process..."
    echo ""
    
    check_docker
    setup_database
    start_backend
    setup_frontend
    test_application
    show_final_info
}

# Run main function
main 