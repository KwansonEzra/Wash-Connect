import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useGetMyLSPQuery, useUpdateLSPPricingMutation } from '../../redux/api/lspApiSlice';
import { useGetServiceCategoriesQuery } from '../../redux/api/serviceCatalogApiSlice';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';

// item.category may come back from the API as a populated
// { _id, name, ... } object or as a plain id string - normalize either
// shape down to just the id string for comparisons and for submission.
const categoryIdOf = (category) => category?._id || category;

const LSPServicePricing = () => {
  const { data: lsp, isLoading: lspLoading, error: lspError, refetch } = useGetMyLSPQuery();
  const { data: categories, isLoading: catLoading, error: catError } = useGetServiceCategoriesQuery();

  const [updatePricing, { isLoading: updating, isSuccess }] = useUpdateLSPPricingMutation();

  const [pricing, setPricing] = useState([]);

  useEffect(() => {
    if (lsp && categories) {
      // Initialize pricing state based on the LSP's existing pricing and
      // the full catalog of available categories/items.
      const initialPricing = categories.flatMap((category) => {
        const lspCategoryPricing = lsp.pricing.filter(
          (p) => categoryIdOf(p.category) === category._id
        );
        return category.items.map((itemKey) => {
          const existingItem = lspCategoryPricing.find((p) => p.itemKey === itemKey);
          return {
            category: category._id,
            itemKey,
            label: existingItem?.label || itemKey,
            unitPrice: existingItem ? existingItem.unitPrice : 0,
          };
        });
      });
      setPricing(initialPricing);
    }
  }, [lsp, categories]);

  const handlePriceChange = (index, newPrice) => {
    setPricing((prev) =>
      prev.map((item, i) => (i === index ? { ...item, unitPrice: parseFloat(newPrice) || 0 } : item))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // The backend expects a plain category id string per item - never
      // the populated category object.
      const payload = pricing.map((i) => ({
        category: categoryIdOf(i.category),
        itemKey: i.itemKey,
        label: i.label,
        unitPrice: i.unitPrice,
      }));

      await updatePricing({ pricing: payload }).unwrap();
      toast.success('Pricing updated successfully!');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update pricing');
    }
  };

  if (lspLoading || catLoading) return <Loader />;
  if (lspError) return <Message variant="danger">{lspError.data?.message || lspError.error}</Message>;
  if (catError) return <Message variant="danger">{catError.data?.message || catError.error}</Message>;
  if (!lsp) return <Message variant="warning">LSP profile not found.</Message>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Service Pricing</h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Set Prices for Your Services</h2>
          <p className="text-gray-600 mb-6">Enter the price per unit for each service item you offer.</p>

          {categories?.map((category) => (
            <div key={category._id} className="mb-8 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">{category.name}</h3>
              {category.items.map((itemKey) => {
                const pricingIndex = pricing.findIndex(
                  (p) => p.category === category._id && p.itemKey === itemKey
                );
                if (pricingIndex === -1) return null;

                return (
                  <div
                    key={`${category._id}-${itemKey}`}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-gray-700">{itemKey}</span>
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-600">NGN</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={pricing[pricingIndex].unitPrice}
                        onChange={(e) => handlePriceChange(pricingIndex, e.target.value)}
                        className="w-24 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
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
          {updating ? 'Updating Prices...' : 'Save Pricing Changes'}
        </button>
      </form>

      {isSuccess && <Message variant="success">Pricing updated successfully!</Message>}
    </div>
  );
};

export default LSPServicePricing;
