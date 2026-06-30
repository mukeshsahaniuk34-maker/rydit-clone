import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchRides from './pages/SearchRides';
import RideDetail from './pages/RideDetail';
import MyBookings from './pages/MyBookings';
import UserProfile from './pages/UserProfile';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Payment from './pages/Payment';

const App = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
            
            {/* Protected Routes */}
            <Route 
              path="/search-rides" 
              element={isAuthenticated ? <SearchRides /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/ride/:id" 
              element={isAuthenticated ? <RideDetail /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/my-bookings" 
              element={isAuthenticated ? <MyBookings /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/payment/:rideId" 
              element={isAuthenticated ? <Payment /> : <Navigate to="/login" />} 
            />
            
            {/* Driver Routes */}
            <Route 
              path="/driver-dashboard" 
              element={user?.role === 'driver' ? <DriverDashboard /> : <Navigate to="/" />} 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin-dashboard" 
              element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
