import { Link } from 'react-router-dom';
import { useGetMetricsQuery, useGetPendingLSPsQuery } from '../../redux/api/adminApiSlice';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';

const AdminDashboard = () => {
  const { data: metrics, isLoading, error } = useGetMetricsQuery();
  const { data: pendingLSPs } = useGetPendingLSPsQuery();

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data?.message || error.error}</Message>;

  if (!metrics) {
    return <Message variant="warning">No metrics data available.</Message>;
  }

  const { totalCustomers, totalLSPs, totalBookings, totalBookingsToday, bookingsPerState } = metrics;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Customers</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalCustomers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total LSPs</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalLSPs}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Bookings Today</h3>
          <p className="text-3xl font-bold text-green-600">{totalBookingsToday}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Bookings by State</h2>
          {bookingsPerState && bookingsPerState.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {bookingsPerState.map((stateStat) => (
                <li key={stateStat._id} className="py-3 flex justify-between">
                  <span className="text-gray-600">{stateStat.stateName}</span>
                  <span className="font-medium">{stateStat.bookingCount}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Message variant="info">No booking data by state.</Message>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            <Link to="/admin/users" className="bg-indigo-600 text-white p-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 flex items-center">
              <span className="text-lg font-medium">Manage Users</span>
            </Link>
            <Link to="/admin/lsps" className="bg-purple-600 text-white p-4 rounded-lg shadow-md hover:bg-purple-700 transition duration-300 flex items-center">
              <span className="text-lg font-medium">Manage LSPs</span>
            </Link>
            <Link to="/admin/lsps/pending" className="bg-yellow-600 text-white p-4 rounded-lg shadow-md hover:bg-yellow-700 transition duration-300 flex items-center">
              <span className="text-lg font-medium">Verify LSPs ({pendingLSPs?.length ?? 0})</span>
            </Link>
            <Link to="/admin/bookings" className="bg-teal-600 text-white p-4 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 flex items-center">
              <span className="text-lg font-medium">View All Bookings</span>
            </Link>
            <Link to="/admin/service-catalog" className="bg-pink-600 text-white p-4 rounded-lg shadow-md hover:bg-pink-700 transition duration-300 flex items-center">
              <span className="text-lg font-medium">Manage Services</span>
            </Link>
            <Link to="/admin/locations" className="bg-gray-600 text-white p-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 flex items-center">
              <span className="text-lg font-medium">Manage Locations</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;