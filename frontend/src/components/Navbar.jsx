import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            🚌 Indian Bus Booking
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-200 transition-colors">
              Home
            </Link>
            <Link to="/search" className="hover:text-blue-200 transition-colors">
              Search Buses
            </Link>

            {user ? (
              <>
                {user.roles?.includes("ROLE_ADMIN") && (
                  <Link to="/admin" className="hover:text-blue-200 transition-colors">
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/my-bookings" className="hover:text-blue-200 transition-colors">
                  My Bookings
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Welcome, {user.fullName}</span>
                  <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
