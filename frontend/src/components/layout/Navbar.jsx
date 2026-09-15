import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/features/auth/authSlice';
import { useLogoutMutation } from '../../redux/api/usersApiSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      // Clear the httpOnly JWT cookie server-side. Without this the cookie
      // stays valid even though the client thinks the user is logged out.
      await logoutApiCall().unwrap();
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      dispatch(logout());
      setMobileMenuOpen(false);
      navigate('/');
    }
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-8" src="/favicon.svg" alt="WashConnect Logo" />
              <span className="ml-2 text-xl font-bold">WashConnect</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/home"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600"
                >
                  Home
                </Link>
                <Link
                  to="/find-lsp"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600"
                >
                  Find LSP
                </Link>
                {userInfo && (
                  <>
                    <Link
                      to="/my-bookings"
                      className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600"
                    >
                      My Bookings
                    </Link>
                    {userInfo.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600"
                      >
                        Admin
                      </Link>
                    )}
                    {userInfo.role === 'lsp' && (
                      <Link
                        to="/lsp/dashboard"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600"
                      >
                        LSP Dashboard
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {userInfo ? (
                <div className="ml-3 relative">
                  <div className="flex items-center space-x-4">
                    <span>Hello, {userInfo.username}</span>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 focus:outline-none"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="bg-indigo-700 inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-600 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/home"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-600"
            >
              Home
            </Link>
            <Link
              to="/find-lsp"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-600"
            >
              Find LSP
            </Link>
            {userInfo && (
              <>
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-600"
                >
                  My Bookings
                </Link>
                {userInfo.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-600"
                  >
                    Admin
                  </Link>
                )}
                {userInfo.role === 'lsp' && (
                  <Link
                    to="/lsp/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-600"
                  >
                    LSP Dashboard
                  </Link>
                )}
              </>
            )}
            {!userInfo && (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
            {userInfo && (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
