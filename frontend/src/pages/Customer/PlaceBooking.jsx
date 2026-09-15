import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useGetLSPByIdQuery } from '../../redux/api/lspApiSlice';
import { useCreateBookingMutation } from '../../redux/api/bookingApiSlice';
import PriceCalculator from '../../components/customer/PriceCalculator';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import Modal from '../../components/common/Modal';

const PlaceBooking = () => {
  const [searchParams] = useSearchParams();
  const lspId = searchParams.get('lsp');
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const { data: lsp, isLoading, error } = useGetLSPByIdQuery(lspId, { skip: !lspId });
  const [createBooking, { isLoading: isSubmitting }] = useCreateBookingMutation();

  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // MVP: Cash only
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (lsp) {
      // Initialize items state with the LSP's pricing structure.
      // `category` here is the fully-populated ServiceCategory object
      // (from getLSPById), kept for display; it gets flattened back to
      // just its id when we actually submit the booking below.
      const initialItems = lsp.pricing.map((service) => ({
        category: service.category,
        itemKey: service.itemKey,
        label: service.label,
        unitPrice: service.unitPrice,
        qty: 0,
      }));
      setItems(initialItems);
    }
  }, [lsp]);

  const handleQtyChange = (index, newQty) => {
    if (newQty < 0) return;
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, qty: newQty } : item))
    );
  };

  const validItems = useMemo(() => items.filter((item) => item.qty > 0), [items]);
  const subtotal = useMemo(
    () => validItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0),
    [validItems]
  );

  const handleSubmit = () => {
    if (!userInfo) {
      navigate('/login', { state: { from: `/place-booking?lsp=${lspId}` } });
      return;
    }
    if (validItems.length === 0) {
      toast.warn('Please select at least one item with a quantity greater than 0.');
      return;
    }
    setShowNotifyModal(true);
  };

  const confirmNotification = async (notifyOnComplete) => {
    setShowNotifyModal(false);

    try {
      await createBooking({
        lsp: lspId,
        // The backend only needs the plain category id - it recomputes
        // pricing itself from the LSP's own pricing sheet server-side.
        items: validItems.map(({ category, itemKey, label, qty }) => ({
          category: category?._id || category,
          itemKey,
          label,
          qty,
        })),
        notes,
        notifyOnComplete,
        paymentMethod,
      }).unwrap();

      toast.success('Booking submitted! You can track its status under My Bookings.');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to submit booking. Please try again.');
    }
  };

  if (!lspId) return <Message variant="danger">No laundry service provider selected.</Message>;
  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data?.message || error.error}</Message>;
  if (!lsp) return <Message variant="warning">LSP not found.</Message>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Place Booking with {lsp.shopName}</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Select Items</h2>
        <PriceCalculator items={items} onQtyChange={handleQtyChange} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Additional Information</h2>
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Special Instructions or Notes
          </label>
          <textarea
            id="notes"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific instructions for the LSP..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <div className="flex items-center">
            <input
              type="radio"
              id="payment-cash"
              name="paymentMethod"
              value="Cash"
              checked={paymentMethod === 'Cash'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label htmlFor="payment-cash" className="ml-2 block text-sm text-gray-700">
              Pay on Drop-off/Pick-up (Cash)
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Summary</h2>
          <div className="text-lg font-bold text-indigo-600">NGN {subtotal.toLocaleString()}</div>
        </div>
        <div className="mb-6">
          <h3 className="font-medium text-gray-600">Items:</h3>
          {validItems.length === 0 ? (
            <p className="text-gray-500 italic mt-1">No items selected yet.</p>
          ) : (
            <ul className="list-disc pl-5">
              {validItems.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item.qty} x {item.label} (NGN {item.unitPrice.toLocaleString()} each) = NGN{' '}
                  {(item.qty * item.unitPrice).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={validItems.length === 0 || isSubmitting}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            validItems.length === 0 || isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {isSubmitting ? 'Submitting...' : `Submit Booking (NGN ${subtotal.toLocaleString()})`}
        </button>
      </div>

      <Modal show={showNotifyModal} onClose={() => setShowNotifyModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preference</h3>
          <p className="text-gray-600 mb-6">Would you like to be notified when your laundry is ready?</p>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none disabled:opacity-50"
              onClick={() => confirmNotification(false)}
            >
              No Thanks
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
              onClick={() => confirmNotification(true)}
            >
              Yes, Notify Me
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PlaceBooking;
