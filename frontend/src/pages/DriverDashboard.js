import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTruck, FiDollarSign, FiUsers, FiStar } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const DriverDashboard = () => {
  const [earnings, setEarnings] = useState(null);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    fetchEarnings();
    fetchRides();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await axios.get(`${API_URL}/drivers/earnings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEarnings(response.data.earnings);
    } catch (error) {
      console.error('Failed to fetch earnings');
    }
  };

  const fetchRides = async () => {
    try {
      const response = await axios.get(`${API_URL}/drivers/rides`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRides(response.data.rides);
    } catch (error) {
      console.error('Failed to fetch rides');
    }
  };

  if (!earnings) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Driver Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FiDollarSign className="text-2xl text-blue-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Earnings</p>
            <p className="text-2xl font-bold text-gray-800">₹{earnings.totalEarnings}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <FiTruck className="text-2xl text-green-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Rides</p>
            <p className="text-2xl font-bold text-gray-800">{earnings.totalRides}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <FiUsers className="text-2xl text-purple-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Completed Rides</p>
            <p className="text-2xl font-bold text-gray-800">{earnings.completedRides}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <FiStar className="text-2xl text-yellow-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Rating</p>
            <p className="text-2xl font-bold text-gray-800">{earnings.rating}★</p>
          </div>
        </div>
      </div>

      {/* Upcoming Rides */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Rides</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="py-3 px-4 text-gray-700 font-semibold">Route</th>
                <th className="py-3 px-4 text-gray-700 font-semibold">Departure</th>
                <th className="py-3 px-4 text-gray-700 font-semibold">Passengers</th>
                <th className="py-3 px-4 text-gray-700 font-semibold">Status</th>
                <th className="py-3 px-4 text-gray-700 font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {rides.map(ride => (
                <tr key={ride._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{ride.route}</td>
                  <td className="py-3 px-4">{new Date(ride.departureTime).toLocaleString()}</td>
                  <td className="py-3 px-4">{ride.passengers.length}/{ride.totalSeats}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {ride.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold">₹{ride.totalRevenue || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
