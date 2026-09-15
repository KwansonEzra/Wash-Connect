import { toast } from 'react-toastify';
import { useGetPendingLSPsQuery } from '../../redux/api/adminApiSlice';
import { useVerifyLSPMutation } from '../../redux/api/lspApiSlice';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';

const PendingLSPs = () => {
  const { data: lsps, isLoading, error, refetch } = useGetPendingLSPsQuery();
  const [verifyLSP, { isLoading: verifying }] = useVerifyLSPMutation();

  const handleDecision = async (id, verified) => {
    try {
      await verifyLSP({ id, verified }).unwrap();
      toast.success(verified ? 'LSP approved' : 'LSP rejected');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update LSP verification status');
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data?.message || error.error}</Message>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Pending LSP Verifications</h1>

      {lsps && lsps.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shop Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lsps.map((lsp) => (
                <tr key={lsp._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {lsp.shopName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lsp.owner?.username} ({lsp.owner?.email})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lsp.location?.name}, {lsp.state?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      disabled={verifying}
                      onClick={() => handleDecision(lsp._id, true)}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      disabled={verifying}
                      onClick={() => handleDecision(lsp._id, false)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Message variant="info">No LSPs are currently awaiting verification.</Message>
      )}
    </div>
  );
};

export default PendingLSPs;
