import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {userInfo ? `Welcome back, ${userInfo.username}!` : 'Welcome to WashConnect'}
      </h1>
      <p className="text-gray-600 mb-8">
        Find trusted laundry service providers near you and track your bookings in one place.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          to="/find-lsp"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-indigo-600 mb-2">Find a Laundromat</h2>
          <p className="text-gray-600">Search verified providers by state and location.</p>
        </Link>

        {userInfo ? (
          <Link
            to="/my-bookings"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">My Bookings</h2>
            <p className="text-gray-600">Check the status of your active and past bookings.</p>
          </Link>
        ) : (
          <Link
            to="/register"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">Create an Account</h2>
            <p className="text-gray-600">Sign up to place bookings and track your laundry.</p>
          </Link>
        )}

        {userInfo?.role === 'lsp' && (
          <Link
            to="/lsp/dashboard"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">LSP Dashboard</h2>
            <p className="text-gray-600">Manage your shop, pricing, availability, and bookings.</p>
          </Link>
        )}

        {userInfo?.role === 'admin' && (
          <Link
            to="/admin/dashboard"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">Admin Dashboard</h2>
            <p className="text-gray-600">Review platform metrics, users, and LSP verifications.</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
