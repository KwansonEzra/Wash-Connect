import { useParams } from 'react-router-dom';
import { useGetLSPByIdQuery } from '../../redux/api/lspApiSlice';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import LSPTabs from '../../components/customer/LSPTabs';

const LSPDetails = () => {
  const { id: lspId } = useParams();

  const { data: lsp, isLoading, error } = useGetLSPByIdQuery(lspId);

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data?.message || error.error}</Message>;

  if (!lsp) {
    return <Message variant="warning">LSP not found.</Message>;
  }

  const { shopName, bio, logo, rating, numReviews, addressLine, state, location, hours } = lsp;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{shopName}</h1>
              <div className="flex items-center mt-2">
                <span className="text-gray-600">Rating:</span>
                <span className="ml-2 text-indigo-600 font-semibold">{(rating ?? 0).toFixed(1)}</span>
                <span className="ml-1 text-gray-500">({numReviews} reviews)</span>
              </div>
            </div>
            {logo ? (
              <img
                src={logo}
                alt={`${shopName} logo`}
                className="w-24 h-24 rounded-xl object-cover border border-gray-200"
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24" />
            )}
          </div>
          <p className="text-gray-600 mt-4">{bio}</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700">Address</h3>
              <p className="text-gray-600">
                {addressLine}, {location?.name}, {state?.name}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700">Operating Hours</h3>
              <p className="text-gray-600">
                {hours?.open && hours?.close ? `${hours.open} - ${hours.close}` : 'Not set yet'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <LSPTabs lsp={lsp} />
    </div>
  );
};

export default LSPDetails;