import BookingStatusPill from '../customer/BookingStatusPill';

const LSPBookingRow = ({ booking, onAccept, onDecline, isActionLoading }) => {
  const { _id, customer, total, items, status } = booking;

  // Truncate items list for display
  const itemSummary = items.slice(0, 3).map(item => `${item.qty} x ${item.label}`).join(', ');
  const extraItemCount = items.length - 3;
  const itemsDisplay = extraItemCount > 0 ? `${itemSummary} + ${extraItemCount} more` : itemSummary;

  return (
    <tr key={_id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        #{_id.substring(0, 8)}...
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {customer.username}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {total.toLocaleString()}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
        {itemsDisplay}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <BookingStatusPill status={status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => onAccept(_id)}
            className="text-green-600 hover:text-green-900 disabled:opacity-50"
            disabled={isActionLoading || status !== 'pending'}
          >
            Accept
          </button>
          <button
            onClick={() => onDecline(_id)}
            className="text-red-600 hover:text-red-900 disabled:opacity-50"
            disabled={isActionLoading || status !== 'pending'}
          >
            Decline
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LSPBookingRow;