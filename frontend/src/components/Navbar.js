import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome } from 'react-icons/fi';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            R
          </div>
          <span className="text-xl font-bold text-blue-700 hidden sm:inline">Rydit Clone</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/search-rides" className="text-gray-700 hover:text-blue-600 transition">
                Book Ride
              </Link>
              <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600 transition">
                My Bookings
              </Link>
              
              <div className="flex items-center gap-3 border-l pl-6">
                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition">
                  <FiUser className="text-lg" />
                  <span className="hidden lg:inline">{user?.firstName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/search-rides" className="block py-2 text-gray-700 hover:text-blue-600">
                  Book Ride
                </Link>
                <Link to="/my-bookings" className="block py-2 text-gray-700 hover:text-blue-600">
                  My Bookings
                </Link>
                <Link to="/profile" className="block py-2 text-gray-700 hover:text-blue-600">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="block py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
