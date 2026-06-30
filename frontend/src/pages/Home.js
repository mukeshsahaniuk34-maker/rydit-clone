import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiArrowRight, FiTrendingUp, FiAward, FiShield } from 'react-icons/fi';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Affordable Airport Rides</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Book shared or private rides to/from airports with guaranteed departure times
          </p>
          {isAuthenticated ? (
            <Link
              to="/search-rides"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Book Your Ride <FiArrowRight />
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Get Started <FiArrowRight />
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Why Choose Us?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Best Prices</h3>
              <p className="text-gray-600">
                Guaranteed lowest fares with no surge pricing. Share rides and save up to 50%.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="text-3xl text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Reliable Service</h3>
              <p className="text-gray-600">
                Guaranteed departure times. No last-minute cancellations or delays.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="text-3xl text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Safe & Secure</h3>
              <p className="text-gray-600">
                Verified drivers, GPS tracking, and 24/7 emergency support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">50K+</p>
              <p className="text-gray-600">Happy Passengers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">1000+</p>
              <p className="text-gray-600">Verified Drivers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">100K+</p>
              <p className="text-gray-600">Completed Rides</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">4.8★</p>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Book Your Ride?</h2>
          <p className="text-xl mb-8 text-blue-100">Download our app or book online for seamless airport transfers</p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition"
              >
                Sign Up Now
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-blue-700 transition"
              >
                Already a Member?
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
