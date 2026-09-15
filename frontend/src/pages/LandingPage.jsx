import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Connect with Trusted Laundry Service Providers
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Find verified local laundromats, book transparently priced services, and get notified when your laundry is ready.
          </p>
          <div className="mt-10">
            <Link
              to="/find-lsp"
              className="inline-block px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Find Laundromats Near Me
            </Link>
            <Link
              to="/register"
              className="ml-4 inline-block px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-50 transition duration-300 ease-in-out"
            >
              Become a Provider
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-indigo-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Location-Based Search</h3>
            <p className="text-gray-600">Find active laundry service providers in your exact locality with our state and location filters.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-indigo-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Transparent Pricing</h3>
            <p className="text-gray-600">See live-calculated totals based on selected items and quantities before placing your booking.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-indigo-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Real-Time Notifications</h3>
            <p className="text-gray-600">Stay updated on your booking status with in-app, email, and SMS alerts.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;