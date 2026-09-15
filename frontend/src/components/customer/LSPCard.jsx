import { Link } from 'react-router-dom';
import Ratings from '../shared/Ratings';

const LSPCard = ({ lsp }) => {
  const { _id, shopName, bio, logo, rating, numReviews, addressLine, state, location, isActive, isVerified } = lsp;
  const truncatedBio = bio?.length > 100 ? bio.substring(0, 100) + '...' : bio;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{shopName}</h3>
            <div className="flex items-center mt-1">
              <Ratings value={rating} text={`${numReviews} reviews`} />
              {isVerified && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Verified
                </span>
              )}
              {!isActive && (
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  Inactive
                </span>
              )}
            </div>
          </div>
          {logo ? (
            <img
              src={logo}
              alt={`${shopName} logo`}
              className="w-16 h-16 rounded-xl object-cover border border-gray-200"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          )}
        </div>
        <p className="text-gray-600 mt-3 text-sm">{truncatedBio}</p>
        <div className="mt-4 text-sm text-gray-500">
          <p>
            {addressLine}, {location?.name}, {state?.name}
          </p>
        </div>
        <div className="mt-6">
          <Link
            to={`/lsp/${_id}`}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Details & Book
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LSPCard;