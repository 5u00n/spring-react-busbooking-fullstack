import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Users, Bus, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, XCircle, BarChart3, UserPlus, Settings } from "lucide-react";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../config/api";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.BOOKINGS}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        toast.error("Error loading statistics");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.roles?.includes("ROLE_ADMIN")) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
        <p className="text-gray-600">You need admin privileges to access this page.</p>
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

  const StatCard = ({ title, value, icon: Icon, color = "blue" }) => (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.fullName || user.firstName}!</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", name: "Overview", icon: BarChart3 },
              { id: "bookings", name: "Bookings", icon: Calendar },
              { id: "buses", name: "Buses", icon: Bus },
              { id: "users", name: "Users", icon: Users },
              { id: "settings", name: "Settings", icon: Settings },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? "border-primary-500 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Bookings" value={stats?.totalBookings || 0} icon={Calendar} color="blue" />
              <StatCard title="Confirmed Bookings" value={stats?.confirmedBookings || 0} icon={CheckCircle} color="green" />
              <StatCard title="Paid Bookings" value={stats?.paidBookings || 0} icon={DollarSign} color="green" />
              <StatCard title="Pending Payments" value={stats?.pendingPayments || 0} icon={AlertCircle} color="yellow" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">₹{stats?.totalRevenue || 0}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <UserPlus className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Add New User</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Bus className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Add New Bus</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">View All Bookings</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Redirecting to bookings page...</p>
              <button onClick={() => (window.location.href = "/my-bookings")} className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                View All Bookings
              </button>
            </div>
          </div>
        )}

        {/* Buses Tab */}
        {activeTab === "buses" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Bus Management</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Redirecting to bus management page...</p>
              <button onClick={() => (window.location.href = "/admin/buses")} className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                Manage Buses
              </button>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600">User management features coming soon...</p>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600">System settings coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
