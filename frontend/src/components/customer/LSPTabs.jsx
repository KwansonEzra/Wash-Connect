import { useState } from 'react';
import { Link } from 'react-router-dom';
import Ratings from '../shared/Ratings';

const LSPTabs = ({ lsp }) => {
  const [activeTab, setActiveTab] = useState('services');

  const { pricing, rating, numReviews } = lsp;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('services')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'services'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Services & Prices
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'about'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'reviews'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Reviews
          </button>
        </nav>
      </div>
      <div className="p-6">
        {activeTab === 'services' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Service Prices</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price per Unit (NGN)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pricing.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.category?.name || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.unitPrice.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <Link
                to={`/place-booking?lsp=${lsp._id}`} // Pass LSP ID via query param
                className="inline-block py-2 px-6 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
        {activeTab === 'about' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">About {lsp.shopName}</h2>
            <p className="text-gray-600">{lsp.bio}</p>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Reviews ({numReviews})</h2>
            {numReviews > 0 ? (
              <div>
                {/* Render individual reviews here if available in lsp object */}
                <p>Average Rating: <Ratings value={rating} /></p>
                <p>No detailed reviews displayed in this static example.</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No reviews yet for this provider.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LSPTabs;