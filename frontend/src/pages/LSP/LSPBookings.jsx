import { useState } from 'react';
import { useGetLSPBookingsQuery, useAcceptBookingMutation, useDeclineBookingMutation } from '../../redux/api/bookingApiSlice';
import LSPBookingRow from '../../components/lsp/LSPBookingRow';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import Modal from '../../components/common/Modal';

const LSPBookings = () => {
  const { data: bookings, isLoading, error, refetch } = useGetLSPBookingsQuery();

  const [acceptBooking, { isLoading: accepting }] = useAcceptBookingMutation();
  const [declineBooking, { isLoading: declining }] = useDeclineBookingMutation();

  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [declineReason, setDeclineReason] = useState('');

  const handleAccept = async (bookingId) => {
    try {
      await acceptBooking(bookingId).unwrap();
      refetch(); // Refresh the list after action
    } catch (err) {
      console.error(err);
      alert(`Error accepting booking: ${err?.data?.message || err.error}`);
    }
  };

  const handleDeclineClick = (bookingId) => {
    setCurrentBookingId(bookingId);
    setShowDeclineModal(true);
  };

  const handleConfirmDecline = async () => {
    if (!declineReason.trim()) {
      alert('Please provide a reason for declining.');
      return;
    }

    try {
      await declineBooking({ id: currentBookingId, reason: declineReason }).unwrap();
      setShowDeclineModal(false);
      setDeclineReason('');
      setCurrentBookingId(null);
      refetch(); // Refresh the list after action
    } catch (err) {
      console.error(err);
      alert(`Error declining booking: ${err?.data?.message || err.error}`);
    }
  };

  const handleCancelModal = () => {
    setShowDeclineModal(false);
    setDeclineReason('');
    setCurrentBookingId(null);
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data?.message || error.error}</Message>;

  const pendingBookings = bookings?.filter(b => b.status === 'pending') || [];
  const otherBookings = bookings?.filter(b => b.status !== 'pending') || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings (Inbox)</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Pending Requests ({pendingBookings.length})</h2>
        {pendingBookings.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                    Items
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingBookings.map((booking) => (
                  <LSPBookingRow
                    key={booking._id}
                    booking={booking}
                    onAccept={handleAccept}
                    onDecline={handleDeclineClick}
                    isActionLoading={accepting || declining}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Message variant="info">No pending bookings.</Message>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Other Bookings</h2>
        {otherBookings.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {otherBookings.map((booking) => (
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
                        booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'in_progress' ? 'bg-indigo-100 text-indigo-800' :
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'declined' ? 'bg-red-100 text-red-800' :
                        booking.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.updatedAt).toLocaleDateString()} {/* Use updatedAt for status changes */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Message variant="info">No other bookings.</Message>
        )}
      </div>

      {/* Decline Reason Modal */}
      <Modal show={showDeclineModal} onClose={handleCancelModal}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Decline Booking</h3>
          <p className="text-gray-600 mb-4">Please provide a reason for declining this booking.</p>
          <textarea
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            placeholder="Enter reason for decline..."
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
              onClick={handleCancelModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none disabled:opacity-50"
              onClick={handleConfirmDecline}
              disabled={accepting || declining}
            >
              {accepting || declining ? 'Processing...' : 'Confirm Decline'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LSPBookings;