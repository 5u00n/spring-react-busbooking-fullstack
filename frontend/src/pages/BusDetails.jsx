import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";

const BusDetails = () => {
  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    fetchBusDetails();
  }, [id]);

  const fetchBusDetails = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BUSES}/${id}`);
      if (response.ok) {
        const data = await response.json();
        setBus(data);
      }
    } catch (error) {
      console.error("Error fetching bus details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelection = (seatNumber) => {
    setSelectedSeats((prev) => (prev.includes(seatNumber) ? prev.filter((seat) => seat !== seatNumber) : [...prev, seatNumber]));
  };

  const handleBooking = async () => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    setBooking(true);

    try {
      // Create booking for each selected seat
      const bookingPromises = selectedSeats.map(async (seatNumber) => {
        const bookingData = {
          busId: bus.id,
          seatNumber: seatNumber,
        };

        const response = await fetch(`${API_ENDPOINTS.BOOKINGS}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
          if (response.status === 403) {
            // Token is invalid, redirect to login
            navigate("/login");
            throw new Error("Please log in to continue");
          }
          const errorData = await response.json();
          throw new Error(errorData.error || "Booking failed");
        }

        return response.json();
      });

      const bookingResults = await Promise.all(bookingPromises);

      // Redirect to payment page with booking data
      navigate("/payment", {
        state: {
          bookingData: {
            busId: bus.id,
            busNumber: bus.busNumber,
            source: bus.source,
            destination: bus.destination,
            departureTime: bus.departureTime,
            totalAmount: bus.price * selectedSeats.length,
            selectedSeats: selectedSeats, // Add selected seats
            bookings: bookingResults,
          },
        },
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!bus) {
    return <div className="flex justify-center items-center h-screen">Bus not found</div>;
  }

  const totalAmount = bus.price * selectedSeats.length;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Bus Details</h1>

          {/* Bus Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Bus Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Bus Number:</span> {bus.busNumber}
                </div>
                <div>
                  <span className="font-medium">Route:</span> {bus.source} → {bus.destination}
                </div>
                <div>
                  <span className="font-medium">Departure:</span> {new Date(bus.departureTime).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Arrival:</span> {new Date(bus.arrivalTime).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Bus Type:</span> {bus.busType}
                </div>
                <div>
                  <span className="font-medium">Operator:</span> {bus.operator}
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Pricing</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Price per seat:</span> ₹{bus.price}
                </div>
                <div>
                  <span className="font-medium">Available seats:</span> {bus.availableSeats}/{bus.totalSeats}
                </div>
                <div>
                  <span className="font-medium">Selected seats:</span> {selectedSeats.length}
                </div>
                <div className="text-2xl font-bold text-green-600">Total: ₹{totalAmount}</div>
              </div>
            </div>
          </div>

          {/* Seat Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Seats</h2>
            <div className="grid grid-cols-10 gap-2 max-w-2xl">
              {Array.from({ length: bus.totalSeats }, (_, index) => {
                const seatNumber = `A${index + 1}`;
                const isSelected = selectedSeats.includes(seatNumber);
                const isAvailable = bus.availableSeats > index;

                return (
                  <button
                    key={seatNumber}
                    onClick={() => isAvailable && handleSeatSelection(seatNumber)}
                    disabled={!isAvailable}
                    className={`
                                            p-2 rounded text-sm font-medium transition-colors
                                            ${isSelected ? "bg-blue-600 text-white" : isAvailable ? "bg-gray-200 hover:bg-gray-300 text-gray-800" : "bg-red-200 text-gray-500 cursor-not-allowed"}
                                        `}
                  >
                    {seatNumber}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-200 rounded"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>

          {/* Booking Button */}
          <div className="flex justify-center">
            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || booking}
              className={`
                                px-8 py-3 rounded-lg font-medium text-white text-lg
                                ${selectedSeats.length === 0 || booking ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}
                            `}
            >
              {booking ? "Processing..." : `Book ${selectedSeats.length} Seat(s) - ₹${totalAmount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusDetails;
