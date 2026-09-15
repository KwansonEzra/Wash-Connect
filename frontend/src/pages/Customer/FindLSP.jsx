import { useState, useEffect } from 'react';
import { useGetStatesQuery, useGetLocationsByStateIdQuery } from '../../redux/api/locationApiSlice';
import { useGetLSPsQuery } from '../../redux/api/lspApiSlice';
import LSPCard from '../../components/customer/LSPCard';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';

const FindLSP = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLSPs, setFilteredLSPs] = useState([]);

  const { data: states, isLoading: statesLoading, error: statesError } = useGetStatesQuery();
  const {
    data: locations,
    isLoading: locationsLoading,
    error: locationsError,
  } = useGetLocationsByStateIdQuery(selectedState, { skip: !selectedState });

  const {
    data: lsps,
    isLoading: lspsLoading,
    error: lspsError,
  } = useGetLSPsQuery(
    { state: selectedState, location: selectedLocation },
    { skip: !selectedState }
  );

  useEffect(() => {
    if (!lsps) {
      setFilteredLSPs([]);
      return;
    }
    if (!searchTerm) {
      setFilteredLSPs(lsps);
      return;
    }
    const term = searchTerm.toLowerCase();
    setFilteredLSPs(
      lsps.filter(
        (lsp) =>
          lsp.shopName?.toLowerCase().includes(term) ||
          (lsp.bio ?? '').toLowerCase().includes(term)
      )
    );
  }, [lsps, searchTerm]);

  const selectedLocationName = locations?.find((loc) => loc._id === selectedLocation)?.name;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Find a Laundry Service Provider</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            {statesLoading ? (
              <Loader small />
            ) : statesError ? (
              <Message variant="danger">
                {statesError.data?.message || statesError.error || 'Failed to load states'}
              </Message>
            ) : (
              <select
                id="state"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedLocation('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select State</option>
                {states?.map((state) => (
                  <option key={state._id} value={state._id}>
                    {state.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            {locationsLoading ? (
              <Loader small />
            ) : locationsError ? (
              <Message variant="danger">
                {locationsError.data?.message || locationsError.error || 'Failed to load locations'}
              </Message>
            ) : (
              <select
                id="location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                disabled={!selectedState}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              >
                <option value="">All Locations</option>
                {locations?.map((location) => (
                  <option key={location._id} value={location._id}>
                    {location.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search by name
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. Sparkle Laundromat"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {!selectedState ? (
        <Message variant="info">Select a state to see available laundry service providers.</Message>
      ) : lspsLoading ? (
        <Loader />
      ) : lspsError ? (
        <Message variant="danger">
          {lspsError.data?.message || lspsError.error || 'Failed to load providers'}
        </Message>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            Found {filteredLSPs.length} provider{filteredLSPs.length !== 1 ? 's' : ''}
            {selectedLocationName ? ` in ${selectedLocationName}` : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLSPs.map((lsp) => (
              <LSPCard key={lsp._id} lsp={lsp} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FindLSP;
