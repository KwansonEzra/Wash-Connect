import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  useGetMyLSPQuery,
  useCreateLSPMutation,
  useUpdateLSPMutation,
} from '../../redux/api/lspApiSlice';
import { useGetStatesQuery, useGetLocationsByStateIdQuery } from '../../redux/api/locationApiSlice';
import { useGetServiceCategoriesQuery } from '../../redux/api/serviceCatalogApiSlice';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';

const emptyFormData = {
  shopName: '',
  bio: '',
  logo: '',
  state: '',
  location: '',
  addressLine: '',
  servicesOffered: [],
  turnaroundHours: '',
  offersDelivery: false,
};

const LSPProfile = () => {
  const { data: lsp, isLoading, error, refetch } = useGetMyLSPQuery();
  // A 404 here just means this LSP user hasn't created their profile yet -
  // that's an expected first-time state, not an error to block the page on.
  const isNewProfile = error?.status === 404;

  const { data: states } = useGetStatesQuery();
  const { data: categories } = useGetServiceCategoriesQuery();

  const [createLSP, { isLoading: creating }] = useCreateLSPMutation();
  const [updateLSP, { isLoading: updating, isSuccess }] = useUpdateLSPMutation();
  const saving = creating || updating;

  const [formData, setFormData] = useState(emptyFormData);

  const { data: locations } = useGetLocationsByStateIdQuery(formData.state, {
    skip: !formData.state,
  });

  useEffect(() => {
    if (lsp) {
      setFormData({
        shopName: lsp.shopName || '',
        bio: lsp.bio || '',
        logo: lsp.logo || '',
        state: lsp.state?._id || '',
        location: lsp.location?._id || '',
        addressLine: lsp.addressLine || '',
        servicesOffered: lsp.servicesOffered?.map((s) => s._id) || [],
        turnaroundHours: lsp.turnaroundHours || '',
        offersDelivery: lsp.offersDelivery || false,
      });
    }
  }, [lsp]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Changing state invalidates whatever location was previously chosen
      ...(name === 'state' ? { location: '' } : {}),
    }));
  };

  const handleServiceToggle = (categoryId) => {
    setFormData((prev) => {
      const selected = prev.servicesOffered.includes(categoryId);
      return {
        ...prev,
        servicesOffered: selected
          ? prev.servicesOffered.filter((id) => id !== categoryId)
          : [...prev.servicesOffered, categoryId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNewProfile) {
        await createLSP(formData).unwrap();
        toast.success('Your LSP profile has been created and is pending verification.');
      } else {
        await updateLSP(formData).unwrap();
        toast.success('Profile updated successfully!');
      }
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save profile');
    }
  };

  if (isLoading) return <Loader />;
  if (error && !isNewProfile) {
    return <Message variant="danger">{error.data?.message || error.error}</Message>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isNewProfile ? 'Create Your LSP Profile' : 'Edit LSP Profile'}
      </h1>

      {isNewProfile && (
        <div className="mb-6">
          <Message variant="info">
            You haven't set up your shop profile yet. Fill this out to start appearing in customer
            searches (pending admin verification).
          </Message>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Shop Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name *
              </label>
              <input
                type="text"
                id="shopName"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                Logo URL
              </label>
              <input
                type="text"
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Location & Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select State</option>
                {states?.map((state) => (
                  <option key={state._id} value={state._id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                disabled={!formData.state}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              >
                <option value="">
                  {formData.state ? 'Select Location' : 'Select a state first'}
                </option>
                {locations?.map((loc) => (
                  <option key={loc._id} value={loc._id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="addressLine" className="block text-sm font-medium text-gray-700 mb-1">
              Address Line
            </label>
            <input
              type="text"
              id="addressLine"
              name="addressLine"
              value={formData.addressLine}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Services & Operations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Services Offered</label>
              <div className="space-y-2">
                {categories?.length ? (
                  categories.map((category) => (
                    <label key={category._id} className="inline-flex items-center block">
                      <input
                        type="checkbox"
                        checked={formData.servicesOffered.includes(category._id)}
                        onChange={() => handleServiceToggle(category._id)}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2">{category.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No service categories available yet.</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="turnaroundHours" className="block text-sm font-medium text-gray-700 mb-1">
                Standard Turnaround (Hours)
              </label>
              <input
                type="number"
                id="turnaroundHours"
                name="turnaroundHours"
                value={formData.turnaroundHours}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id="offersDelivery"
                    name="offersDelivery"
                    checked={formData.offersDelivery}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2">Offers Delivery</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            saving
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {saving ? 'Saving...' : isNewProfile ? 'Create Profile' : 'Save Profile Changes'}
        </button>
      </form>

      {isSuccess && <Message variant="success">Profile updated successfully!</Message>}
    </div>
  );
};

export default LSPProfile;
