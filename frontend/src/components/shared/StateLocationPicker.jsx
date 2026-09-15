
const StateLocationPicker = ({ states, locations, selectedState, selectedLocation, onSelectState, onSelectLocation }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Select Location</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <select
            id="state-select"
            value={selectedState}
            onChange={(e) => onSelectState(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a state...</option>
            {states.map((state) => (
              <option key={state._id} value={state._id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="location-select" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select
            id="location-select"
            value={selectedLocation}
            onChange={(e) => onSelectLocation(e.target.value)}
            disabled={!selectedState}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
              !selectedState ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          >
            <option value="">Select a location...</option>
            {locations.map((location) => (
              <option key={location._id} value={location._id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StateLocationPicker;