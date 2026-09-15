import { useState, useEffect } from 'react';

const StateLocationForm = ({ title, initialData, onSubmit, onCancel, type, isSubmitting, states = [] }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {type === 'state' && (
          <div className="mb-4">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Code (Optional)
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )}
        {type === 'location' && (
          <div className="mb-4">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <select
              id="state"
              name="state"
              value={formData.state || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
            {type === 'state' ? 'Area (Optional)' : 'Area (Optional)'}
          </label>
          <input
            type="text"
            id="area"
            name="area"
            value={formData.area || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive ?? true}
              onChange={handleChange}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span className="ml-2 block text-sm text-gray-700">
              Is Active
            </span>
          </label>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (title.includes('Edit') ? 'Updating...' : 'Creating...') : (title.includes('Edit') ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StateLocationForm;