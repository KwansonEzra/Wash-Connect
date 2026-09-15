import { Link } from 'react-router-dom';
import { useGetLSPBookingsQuery } from '../../redux/api/bookingApiSlice';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';

const LSPDashboard = () => {
  const { data: bookings, isLoading, error } = useGetLSPBookingsQuery(); // Fetch LSP's bookings

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data?.message || error.error}</Message>;

  // Calculate metrics
  const totalBookings = bookings?.length || 0;
  const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
  const acceptedBookings = bookings?.filter(b => b.status === 'accepted' || b.status === 'in_progress').length || 0;
  const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;

  // Revenue calculation (example)
  const revenue = bookings?.reduce((acc, booking) => {
    if (booking.status === 'completed') {
      return acc + booking.total;
    }
    return acc;
  }, 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">LSP Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Accepted/In Progress</h3>
          <p className="text-3xl font-bold text-blue-600">{acceptedBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{completedBookings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
          <h3 className="text-lg font-semibold text-gray-700">Revenue (NGN)</h3>
          <p className="text-3xl font-bold text-purple-600">{revenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Recent Bookings</h2>
          <Link to="/lsp/bookings" className="text-indigo-600 hover:underline">View All</Link>
        </div>
        {bookings && bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total (NGN)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.slice(0, 5).map((booking) => ( // Show last 5
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{booking._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.customer.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'in_progress' ? 'bg-indigo-100 text-indigo-800' :
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Message variant="info">No recent bookings.</Message>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/lsp/bookings" className="bg-indigo-600 text-white p-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center">
          <i className="fas fa-inbox text-xl mr-2"></i>
          <span className="text-lg font-medium">View Booking Inbox ({pendingBookings})</span>
        </Link>
        <Link to="/lsp/pricing" className="bg-purple-600 text-white p-6 rounded-lg shadow-md hover:bg-purple-700 transition duration-300 flex items-center justify-center">
          <i className="fas fa-tags text-xl mr-2"></i>
          <span className="text-lg font-medium">Manage Pricing</span>
        </Link>
        <Link to="/lsp/availability" className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:bg-teal-700 transition duration-300 flex items-center justify-center">
          <i className="fas fa-clock text-xl mr-2"></i>
          <span className="text-lg font-medium">Manage Availability</span>
        </Link>
        <Link to="/lsp/profile" className="bg-gray-600 text-white p-6 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 flex items-center justify-center">
          <i className="fas fa-user text-xl mr-2"></i>
          <span className="text-lg font-medium">Edit Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default LSPDashboard;