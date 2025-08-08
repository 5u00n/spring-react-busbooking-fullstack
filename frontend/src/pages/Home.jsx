import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bus, Search, Calendar, MapPin, Clock, DollarSign } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";
import toast from "react-hot-toast";

const Home = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllBuses();
  }, []);

  const fetchAllBuses = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BUSES}`);
      if (response.ok) {
        const data = await response.json();
        setBuses(data);
      } else {
        toast.error("Failed to load buses");
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <Bus className="h-16 w-16 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to BusBooking</h1>
        <p className="text-xl text-gray-600 mb-8">Book your bus tickets easily and securely. Travel across the country with comfort and convenience.</p>
        <Link to="/search" className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors">
          <Search className="h-5 w-5" />
          <span>Search Buses</span>
        </Link>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Search className="h-12 w-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
          <p className="text-gray-600">Find buses between any two cities with our advanced search functionality.</p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Calendar className="h-12 w-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Flexible Booking</h3>
          <p className="text-gray-600">Book tickets for any date and time that suits your travel plans.</p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <MapPin className="h-12 w-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Wide Coverage</h3>
          <p className="text-gray-600">Travel to major cities across the country with our extensive network.</p>
        </div>
      </div>

      {/* Available Buses */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Available Buses</h2>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600">Loading buses...</span>
          </div>
        ) : buses.length > 0 ? (
          <div className="space-y-4">
            {buses.map((bus) => (
              <div key={bus.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{bus.busNumber}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{bus.availableSeats} seats available</span>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">From</p>
                          <p className="font-medium">{bus.source}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">To</p>
                          <p className="font-medium">{bus.destination}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Departure</p>
                          <p className="font-medium">{formatDateTime(bus.departureTime)}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Price</p>
                          <p className="font-medium text-primary-600">₹{bus.price}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{bus.busType}</span> • {bus.operator}
                      </div>
                      <Link to={`/bus/${bus.id}`} className="btn-primary flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>View Seats</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No buses available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
