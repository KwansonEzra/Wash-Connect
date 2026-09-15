import { useSelector } from 'react-redux';
import { useGetMyBookingsQuery } from '../../redux/api/bookingApiSlice'; // You'll need to define this endpoint
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import BookingStatusPill from '../../components/customer/BookingStatusPill';

const MyBookings = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const { data: bookings, isLoading, error } = useGetMyBookingsQuery(undefined, { skip: !userInfo });

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data?.message || error.error}</Message>;

  if (!bookings || bookings.length === 0) {
    return <Message variant="info">You have no bookings yet.</Message>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Booking ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                LSP Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total (NGN)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{booking._id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.lsp.shopName} {/* Assuming lsp object is populated */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {booking.total.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <BookingStatusPill status={booking.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(booking.createdAt).toLocaleDateString()} {/* Assuming createdAt exists */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBookings;