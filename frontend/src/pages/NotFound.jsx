import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h1 className="text-9xl font-bold text-indigo-600">404</h1>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Page Not Found</h2>
            <p className="mt-2 text-gray-600">
              Sorry, the page you are looking for does not exist.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-block px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go Back Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;