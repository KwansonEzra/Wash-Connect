import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/common/PrivateRoute';

import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import FindLSP from './pages/Customer/FindLSP';
import LSPDetails from './pages/Customer/LSPDetails';
import PlaceBooking from './pages/Customer/PlaceBooking';
import MyBookings from './pages/Customer/MyBookings';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NotFound from './pages/NotFound';

import LSPDashboard from './pages/LSP/LSPDashboard';
import LSPBookings from './pages/LSP/LSPBookings';
import LSPServicePricing from './pages/LSP/LSPServicePricing';
import LSPAvailability from './pages/LSP/LSPAvailability';
import LSPProfile from './pages/LSP/LSPProfile';

import AdminDashboard from './pages/Admin/AdminDashboard';
import UserList from './pages/Admin/UserList';
import LSPList from './pages/Admin/LSPList';
import PendingLSPs from './pages/Admin/PendingLSPs';
import BookingList from './pages/Admin/BookingList';
import ServiceCatalogList from './pages/Admin/ServiceCatalogList';
import StateLocationList from './pages/Admin/StateLocationList';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/find-lsp" element={<FindLSP />} />
            <Route path="/lsp/:id" element={<LSPDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer-only routes */}
            <Route element={<PrivateRoute roles={['customer']} />}>
              <Route path="/place-booking" element={<PlaceBooking />} />
              <Route path="/my-bookings" element={<MyBookings />} />
            </Route>

            {/* LSP-owner-only routes. These pages existed before but were
                never reachable because no routes pointed to them. */}
            <Route element={<PrivateRoute roles={['lsp']} />}>
              <Route path="/lsp/dashboard" element={<LSPDashboard />} />
              <Route path="/lsp/bookings" element={<LSPBookings />} />
              <Route path="/lsp/pricing" element={<LSPServicePricing />} />
              <Route path="/lsp/availability" element={<LSPAvailability />} />
              <Route path="/lsp/profile" element={<LSPProfile />} />
            </Route>

            {/* Admin-only routes. Same story - fully built, never routed. */}
            <Route element={<PrivateRoute roles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/lsps/pending" element={<PendingLSPs />} />
              <Route path="/admin/lsps" element={<LSPList />} />
              <Route path="/admin/bookings" element={<BookingList />} />
              <Route path="/admin/service-catalog" element={<ServiceCatalogList />} />
              <Route path="/admin/locations" element={<StateLocationList />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
