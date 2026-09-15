import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useGetMyLSPQuery, useUpdateLSPAvailabilityMutation } from '../../redux/api/lspApiSlice';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';

const LSPAvailability = () => {
  const { data: lsp, isLoading, error, refetch } = useGetMyLSPQuery();

  const [updateAvailability, { isLoading: updating, isSuccess }] = useUpdateLSPAvailabilityMutation();

  // State for form inputs
  const [hours, setHours] = useState({ open: '08:00', close: '18:00', days: [1, 2, 3, 4, 5] }); // Default Mon-Fri
  const [acceptsCustomOrders, setAcceptsCustomOrders] = useState(false);

  useEffect(() => {
    if (lsp) {
      setHours(lsp.hours || { open: '08:00', close: '18:00', days: [1, 2, 3, 4, 5] });
      setAcceptsCustomOrders(lsp.acceptsCustomOrders || false);
    }
  }, [lsp]);

  const handleDayToggle = (dayIndex) => {
    setHours(prev => {
      const newDays = [...prev.days];
      const dayExists = newDays.includes(dayIndex);
      if (dayExists) {
        return { ...prev, days: newDays.filter(d => d !== dayIndex) };
      } else {
        return { ...prev, days: [...newDays, dayIndex].sort((a, b) => a - b) };
      }
    });
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAvailability({ hours, acceptsCustomOrders }).unwrap();
      toast.success('Availability updated successfully!');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update availability');
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data?.message || error.error}</Message>;
  if (!lsp) return <Message variant="warning">LSP profile not found.</Message>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Availability</h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Set Opening Hours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="open-time" className="block text-sm font-medium text-gray-700 mb-1">
                Opening Time
              </label>
              <input
                type="time"
                id="open-time"
                value={hours.open}
                onChange={(e) => setHours({...hours, open: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="close-time" className="block text-sm font-medium text-gray-700 mb-1">
                Closing Time
              </label>
              <input
                type="time"
                id="close-time"
                value={hours.close}
                onChange={(e) => setHours({...hours, close: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Open Days</h3>
            <div className="flex flex-wrap gap-2">
              {dayNames.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDayToggle(index)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    hours.days.includes(index)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Preferences</h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="accept-custom-orders"
              checked={acceptsCustomOrders}
              onChange={(e) => setAcceptsCustomOrders(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="accept-custom-orders" className="ml-2 block text-sm text-gray-700">
              Accept Custom Orders
            </label>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            If enabled, customers can request items not listed in your standard service catalog.
          </p>
        </div>

        <button
          type="submit"
          disabled={updating}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            updating
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {updating ? 'Saving...' : 'Save Availability Settings'}
        </button>
      </form>

      {isSuccess && (
        <Message variant="success">Availability settings updated successfully!</Message>
      )}
    </div>
  );
};

export default LSPAvailability;