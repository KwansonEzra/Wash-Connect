import { useState } from 'react';
import { useGetServiceCategoriesQuery, useCreateServiceCategoryMutation, useUpdateServiceCategoryMutation, useDeleteServiceCategoryMutation } from '../../redux/api/serviceCatalogApiSlice';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import Modal from '../../components/common/Modal';

const ServiceCatalogList = () => {

  const { data: categories, isLoading, error, refetch } = useGetServiceCategoriesQuery();

  const [createCategory, { isLoading: creating }] = useCreateServiceCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateServiceCategoryMutation();
  const [deleteCategory, { isLoading: deleting }] = useDeleteServiceCategoryMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [currentCategory, setCurrentCategory] = useState({ _id: '', name: '', items: [], allowsCustomItem: false });
  const [newCategory, setNewCategory] = useState({ name: '', items: '', allowsCustomItem: false }); // items as comma-separated string for input

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemsArray = newCategory.items.split(',').map(item => item.trim()).filter(item => item);
      await createCategory({ ...newCategory, items: itemsArray }).unwrap();
      setNewCategory({ name: '', items: '', allowsCustomItem: false });
      setShowCreateModal(false);
      refetch();
    } catch (err) {
      console.error(err);
      alert(`Error creating category: ${err?.data?.message || err.error}`);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCategory({ id: currentCategory._id, ...currentCategory }).unwrap();
      setShowEditModal(false);
      refetch();
    } catch (err) {
      console.error(err);
      alert(`Error updating category: ${err?.data?.message || err.error}`);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await deleteCategory(currentCategory._id).unwrap();
      setShowDeleteModal(false);
      refetch();
    } catch (err) {
      console.error(err);
      alert(`Error deleting category: ${err?.data?.message || err.error}`);
    }
  };

  const openEditModal = (category) => {
    setCurrentCategory({ ...category, items: category.items.join(',') }); // Convert array to string for input
    setShowEditModal(true);
  };

  const openDeleteModal = (category) => {
    setCurrentCategory(category);
    setShowDeleteModal(true);
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data?.message || error.error}</Message>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Service Catalog</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Category
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Allows Custom
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories?.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {category.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {category.items.join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.allowsCustomItem ? 'Yes' : 'No'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openEditModal(category)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(category)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Service Category</h3>
          <form onSubmit={handleCreateSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="items" className="block text-sm font-medium text-gray-700 mb-1">
                Items (comma-separated)
              </label>
              <input
                type="text"
                id="items"
                value={newCategory.items}
                onChange={(e) => setNewCategory({...newCategory, items: e.target.value})}
                placeholder="e.g., tshirt, trad, trousers"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={newCategory.allowsCustomItem}
                  onChange={(e) => setNewCategory({...newCategory, allowsCustomItem: e.target.checked})}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 block text-sm text-gray-700">
                  Allows Custom Item
                </span>
              </label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none ${
                  creating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Service Category</h3>
          <form onSubmit={handleEditSubmit}>
            <div className="mb-4">
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="edit-name"
                value={currentCategory.name}
                onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="edit-items" className="block text-sm font-medium text-gray-700 mb-1">
                Items (comma-separated)
              </label>
              <input
                type="text"
                id="edit-items"
                value={currentCategory.items}
                onChange={(e) => setCurrentCategory({...currentCategory, items: e.target.value.split(',').map(item => item.trim())})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={currentCategory.allowsCustomItem}
                  onChange={(e) => setCurrentCategory({...currentCategory, allowsCustomItem: e.target.checked})}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 block text-sm text-gray-700">
                  Allows Custom Item
                </span>
              </label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none ${
                  updating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {updating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Service Category</h3>
          <p className="text-gray-600 mb-4">Are you sure you want to delete the category "{currentCategory.name}"? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteSubmit}
              disabled={deleting}
              className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none ${
                deleting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ServiceCatalogList;