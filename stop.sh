#!/bin/bash

# Bus Booking System Stop Script
# This script stops the application and cleans up resources

echo "🛑 Stopping Bus Booking System"
echo "=============================="

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

# Stop Spring Boot application
stop_backend() {
    print_status "Stopping Spring Boot application..."
    
    # Find and kill processes on port 8080
    if lsof -ti:8080 > /dev/null 2>&1; then
        lsof -ti:8080 | xargs kill -9
        print_success "Backend stopped"
    else
        print_warning "No backend process found on port 8080"
    fi
}

# Stop MySQL container
stop_database() {
    print_status "Stopping MySQL container..."
    
    if docker ps | grep -q "mysql-busbooking"; then
        docker stop mysql-busbooking
        print_success "MySQL container stopped"
    else
        print_warning "MySQL container not found"
    fi
}

# Clean up Docker resources
cleanup_docker() {
    print_status "Cleaning up Docker resources..."
    
    # Remove stopped containers
    docker container prune -f
    
    # Remove unused networks
    docker network prune -f
    
    print_success "Docker cleanup completed"
}

# Remove log files
cleanup_logs() {
    print_status "Cleaning up log files..."
    
    if [ -f "backend.log" ]; then
        rm backend.log
        print_success "Backend log removed"
    fi
}

# Display final status
show_status() {
    echo ""
    echo "📊 Current Status:"
    echo "=================="
    echo ""
    
    # Check backend
    if lsof -ti:8080 > /dev/null 2>&1; then
        echo "❌ Backend: Still running on port 8080"
    else
        echo "✅ Backend: Stopped"
    fi
    
    # Check MySQL
    if docker ps | grep -q "mysql-busbooking"; then
        echo "❌ MySQL: Still running"
    else
        echo "✅ MySQL: Stopped"
    fi
    
    echo ""
    echo "🔄 To restart the application:"
    echo "   ./setup.sh"
    echo ""
    echo "🗑️  To completely clean up:"
    echo "   docker rm mysql-busbooking"
    echo ""
}

# Main execution
main() {
    stop_backend
    stop_database
    cleanup_docker
    cleanup_logs
    show_status
}

# Run main function
main 