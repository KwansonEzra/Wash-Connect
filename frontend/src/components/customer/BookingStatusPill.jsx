
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  declined: 'bg-red-100 text-red-800',
  in_progress: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const BookingStatusPill = ({ status }) => {
  const displayStatus = status.replace(/_/g, ' ').toUpperCase(); // Format status string
  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {displayStatus}
    </span>
  );
};

export default BookingStatusPill;