import { useState } from 'react';
import { useGetStatesQuery, useGetLocationsByStateIdQuery, useCreateStateMutation, useUpdateStateMutation, useDeleteStateMutation, useCreateLocationMutation, useUpdateLocationMutation, useDeleteLocationMutation } from '../../redux/api/locationApiSlice';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import Modal from '../../components/common/Modal';
import StateLocationForm from '../../components/admin/StateLocationForm';

const StateLocationList = () => {

  const { data: states, isLoading: statesLoading, error: statesError, refetch: refetchStates } = useGetStatesQuery();
  const [selectedStateId, setSelectedStateId] = useState('');
  const { data: locations, isLoading: locsLoading, error: locsError, refetch: refetchLocations } = useGetLocationsByStateIdQuery(selectedStateId, { skip: !selectedStateId });

  // Mutations
  const [createState, { isLoading: creatingState }] = useCreateStateMutation();
  const [updateState, { isLoading: updatingState }] = useUpdateStateMutation();
  const [deleteState, { isLoading: deletingState }] = useDeleteStateMutation();
  const [createLocation, { isLoading: creatingLocation }] = useCreateLocationMutation();
  const [updateLocation, { isLoading: updatingLocation }] = useUpdateLocationMutation();
  const [deleteLocation, { isLoading: deletingLocation }] = useDeleteLocationMutation();

  // Modal states
  const [showCreateStateModal, setShowCreateStateModal] = useState(false);
  const [showEditStateModal, setShowEditStateModal] = useState(false);
  const [showCreateLocationModal, setShowCreateLocationModal] = useState(false);
  const [showEditLocationModal, setShowEditLocationModal] = useState(false);

  // Current item being edited
  const [currentItem, setCurrentItem] = useState({}); // Could be state or location object

  // Handle state selection to load locations
  const handleStateSelect = (e) => {
    setSelectedStateId(e.target.value);
  };

  // Handlers for modals
  const openCreateStateModal = () => {
    setCurrentItem({ name: '', code: '', isActive: true });
    setShowCreateStateModal(true);
  };

  const openEditStateModal = (state) => {
    setCurrentItem({ ...state });
    setShowEditStateModal(true);
  };

  const openCreateLocationModal = () => {
    if (!selectedStateId) {
      alert('Please select a state first.');
      return;
    }
    setCurrentItem({ name: '', state: selectedStateId, area: '', isActive: true });
    setShowCreateLocationModal(true);
  };

  const openEditLocationModal = (location) => {
    setCurrentItem({ ...location });
    setShowEditLocationModal(true);
  };

  // Submit handlers
  const handleCreateStateSubmit = async (data) => {
    try {
      await createState(data).unwrap();
      setShowCreateStateModal(false);
      refetchStates();
    } catch (err) {
      console.error(err);
      alert(`Error creating state: ${err?.data?.message || err.error}`);
    }
  };

  const handleUpdateStateSubmit = async (data) => {
    try {
      await updateState(data).unwrap();
      setShowEditStateModal(false);
      refetchStates();
    } catch (err) {
      console.error(err);
      alert(`Error updating state: ${err?.data?.message || err.error}`);
    }
  };

  const handleDeleteState = async (id) => {
    if (!window.confirm('Are you sure you want to delete this state and all its locations?')) return;
    try {
      await deleteState(id).unwrap();
      if (selectedStateId === id) setSelectedStateId(''); // Clear selection if deleted state was selected
      refetchStates();
    } catch (err) {
      console.error(err);
      alert(`Error deleting state: ${err?.data?.message || err.error}`);
    }
  };

  const handleCreateLocationSubmit = async (data) => {
    try {
      await createLocation(data).unwrap();
      setShowCreateLocationModal(false);
      refetchLocations();
    } catch (err) {
      console.error(err);
      alert(`Error creating location: ${err?.data?.message || err.error}`);
    }
  };

  const handleUpdateLocationSubmit = async (data) => {
    try {
      await updateLocation(data).unwrap();
      setShowEditLocationModal(false);
      refetchLocations();
    } catch (err) {
      console.error(err);
      alert(`Error updating location: ${err?.data?.message || err.error}`);
    }
  };

  const handleDeleteLocation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    try {
      await deleteLocation(id).unwrap();
      refetchLocations();
    } catch (err) {
      console.error(err);
      alert(`Error deleting location: ${err?.data?.message || err.error}`);
    }
  };

  if (statesLoading) return <Loader />;
  if (statesError) return <Message variant="danger">{statesError.data?.message || statesError.error}</Message>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage States & Locations</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* States Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">States</h2>
            <button
              onClick={openCreateStateModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add State
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select State to Manage Locations
            </label>
            <select
              id="state-select"
              value={selectedStateId}
              onChange={handleStateSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Select a State --</option>
              {states?.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {states?.map((state) => (
                  <tr key={state._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {state.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {state.code || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        state.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {state.isActive ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditStateModal(state)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteState(state._id)}
                        disabled={deletingState}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Locations Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Locations</h2>
            <button
              onClick={openCreateLocationModal}
              disabled={!selectedStateId}
              className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                !selectedStateId
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Add Location
            </button>
          </div>
          {locsLoading ? (
            <Loader />
          ) : locsError ? (
            <Message variant="danger">{locsError.data?.message || locsError.error}</Message>
          ) : !selectedStateId ? (
            <Message variant="info">Select a state to view and manage its locations.</Message>
          ) : locations && locations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Area
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Active
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {locations.map((location) => (
                    <tr key={location._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {location.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {location.area || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          location.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {location.isActive ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditLocationModal(location)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLocation(location._id)}
                          disabled={deletingLocation}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Message variant="info">No locations found for the selected state.</Message>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal show={showCreateStateModal} onClose={() => setShowCreateStateModal(false)}>
        <StateLocationForm
          title="Add New State"
          initialData={currentItem}
          onSubmit={handleCreateStateSubmit}
          onCancel={() => setShowCreateStateModal(false)}
          type="state"
          isSubmitting={creatingState}
        />
      </Modal>

      <Modal show={showEditStateModal} onClose={() => setShowEditStateModal(false)}>
        <StateLocationForm
          title="Edit State"
          initialData={currentItem}
          onSubmit={handleUpdateStateSubmit}
          onCancel={() => setShowEditStateModal(false)}
          type="state"
          isSubmitting={updatingState}
        />
      </Modal>

      <Modal show={showCreateLocationModal} onClose={() => setShowCreateLocationModal(false)}>
        <StateLocationForm
          title="Add New Location"
          initialData={currentItem}
          onSubmit={handleCreateLocationSubmit}
          onCancel={() => setShowCreateLocationModal(false)}
          type="location"
          isSubmitting={creatingLocation}
          states={states}
        />
      </Modal>

      <Modal show={showEditLocationModal} onClose={() => setShowEditLocationModal(false)}>
        <StateLocationForm
          title="Edit Location"
          initialData={currentItem}
          onSubmit={handleUpdateLocationSubmit}
          onCancel={() => setShowEditLocationModal(false)}
          type="location"
          isSubmitting={updatingLocation}
          states={states}
        />
      </Modal>
    </div>
  );
};

export default StateLocationList;