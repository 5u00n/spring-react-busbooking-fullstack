import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Calendar, MapPin, Clock, DollarSign, X, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../config/api";

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      // Check if user is admin
      const isAdmin = user.roles && user.roles.includes("ROLE_ADMIN");
      const endpoint = isAdmin ? `${API_ENDPOINTS.BOOKINGS}/admin/all` : `${API_ENDPOINTS.BOOKINGS}/user`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        toast.error("Error loading bookings");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingNumber) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BOOKINGS}/${bookingNumber}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Booking cancelled successfully");
        fetchBookings(); // Refresh bookings
      } else {
        toast.error(data.error || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const handlePayment = async (bookingNumber) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BOOKINGS}/${bookingNumber}/payment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Payment processed successfully");
        fetchBookings(); // Refresh bookings
      } else {
        toast.error(data.error || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const handleApproveBooking = async (bookingNumber) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BOOKINGS}/admin/${bookingNumber}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Booking approved successfully");
        fetchBookings(); // Refresh bookings
      } else {
        toast.error(data.error || "Failed to approve booking");
      }
    } catch (error) {
      console.error("Approve error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const handleRejectBooking = async (bookingNumber) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BOOKINGS}/admin/${bookingNumber}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Booking rejected successfully");
        fetchBookings(); // Refresh bookings
      } else {
        toast.error(data.error || "Failed to reject booking");
      }
    } catch (error) {
      console.error("Reject error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">Please login to view your bookings</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const isAdmin = user.roles && user.roles.includes("ROLE_ADMIN");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{isAdmin ? "All Bookings (Admin)" : "My Bookings"}</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">You haven't made any bookings yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking #{booking.bookingNumber}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Route</p>
                          <p className="font-medium">
                            {booking.bus?.source} → {booking.bus?.destination}
                          </p>
                        </div>
                      </div>

                      {isAdmin && (
                        <div className="flex items-center space-x-2">
                          <div>
                            <p className="text-sm text-gray-600">User</p>
                            <p className="font-medium">{booking.user?.fullName || `${booking.user?.firstName} ${booking.user?.lastName}`}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Departure</p>
                          <p className="font-medium">{formatDateTime(booking.bus?.departureTime)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-lg font-bold text-primary-600">${booking.totalAmount}</span>
                    </div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>{booking.status}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>{booking.paymentStatus}</span>
                    <span className="text-sm text-gray-600">Seat {booking.seat?.seatNumber}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isAdmin ? (
                      // Admin actions
                      <>
                        {booking.status === "CONFIRMED" && (
                          <button onClick={() => handleRejectBooking(booking.bookingNumber)} className="btn-secondary flex items-center space-x-1">
                            <X className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        )}
                        {booking.status === "PENDING" && (
                          <button onClick={() => handleApproveBooking(booking.bookingNumber)} className="btn-primary flex items-center space-x-1">
                            <span>✓</span>
                            <span>Approve</span>
                          </button>
                        )}
                      </>
                    ) : (
                      // User actions
                      <>
                        {booking.paymentStatus === "PENDING" && (
                          <button onClick={() => handlePayment(booking.bookingNumber)} className="btn-primary flex items-center space-x-1">
                            <CreditCard className="h-4 w-4" />
                            <span>Pay Now</span>
                          </button>
                        )}

                        {booking.status === "CONFIRMED" && (
                          <button onClick={() => handleCancelBooking(booking.bookingNumber)} className="btn-secondary flex items-center space-x-1">
                            <X className="h-4 w-4" />
                            <span>Cancel</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
