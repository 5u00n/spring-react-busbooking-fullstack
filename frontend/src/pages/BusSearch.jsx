import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Calendar, MapPin, Clock, DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../config/api";

const BusSearch = () => {
  const [searchData, setSearchData] = useState({
    fromLocation: "",
    toLocation: "",
    departureDate: "",
  });
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchData.fromLocation || !searchData.toLocation || !searchData.departureDate) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // Extract only the date part from datetime-local input
      const dateOnly = searchData.departureDate ? searchData.departureDate.split("T")[0] : "";

      const params = new URLSearchParams({
        source: searchData.fromLocation,
        destination: searchData.toLocation,
        date: dateOnly,
      });

      const response = await fetch(`${API_ENDPOINTS.BUSES}/search?${params}`);
      const data = await response.json();

      if (response.ok) {
        setBuses(data);
        if (data.length === 0) {
          toast.error("No buses found for the selected criteria");
        } else {
          toast.success(`Found ${data.length} bus(es)`);
        }
      } else {
        toast.error("Error searching for buses");
      }
    } catch (error) {
      console.error("Search error:", error);
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
      <div className="card mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Buses</h1>

        <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="fromLocation" className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input type="text" id="fromLocation" name="fromLocation" value={searchData.fromLocation} onChange={handleChange} required className="input-field" placeholder="Departure city" />
          </div>

          <div>
            <label htmlFor="toLocation" className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input type="text" id="toLocation" name="toLocation" value={searchData.toLocation} onChange={handleChange} required className="input-field" placeholder="Destination city" />
          </div>

          <div>
            <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input type="datetime-local" id="departureDate" name="departureDate" value={searchData.departureDate} onChange={handleChange} required className="input-field" />
          </div>

          <div className="flex items-end">
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center space-x-2">
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Search className="h-5 w-5" />}
              <span>{loading ? "Searching..." : "Search"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {buses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
          {buses.map((bus) => (
            <div key={bus.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{bus.busNumber}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Available</span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
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
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-lg font-bold text-primary-600">₹{bus.price}</span>
                      <span className="text-sm text-gray-600">per seat</span>
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
      )}

      {/* Quick Search Suggestions */}
      {buses.length === 0 && !loading && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Routes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { from: "Mumbai", to: "Delhi" },
              { from: "Delhi", to: "Bangalore" },
              { from: "Bangalore", to: "Chennai" },
              { from: "Chennai", to: "Hyderabad" },
            ].map((route, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchData({
                    fromLocation: route.from,
                    toLocation: route.to,
                    departureDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                  });
                }}
                className="text-left p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <p className="font-medium text-gray-900">
                  {route.from} → {route.to}
                </p>
                <p className="text-sm text-gray-600">Click to search</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusSearch;
