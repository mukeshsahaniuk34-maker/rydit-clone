import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiTruck, FiBarChart2, FiDollarSign } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchDrivers();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/drivers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDrivers(response.data.drivers);
    } catch (error) {
      console.error('Failed to fetch drivers');
    }
  };

  const approveDriver = async (driverId) => {
    try {
      await axios.post(`${API_URL}/admin/drivers/${driverId}/approve`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchDrivers();
    } catch (error) {
      console.error('Failed to approve driver');
    }
  };

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FiUsers className="text-2xl text-blue-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <FiTruck className="text-2xl text-green-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Drivers</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalDrivers}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <FiBarChart2 className="text-2xl text-purple-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Rides</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalRides}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <FiDollarSign className="text-2xl text-yellow-600" />
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue}</p>
          </div>
        </div>
      </div>

      {/* Pending Drivers */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Driver Approvals</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="py-3 px-4 text-gray-700 font-semibold">Name</th>
                <th className="py-3 px-4 text-gray-700 font-semibold">Email</th>
                <th className="py-3 px-4 text-gray-700 font-semibold">License</th>
                <th className="py-3 px-4 text-gray-700 font-semibold">Status</th>
                <th className="py-3 px-4 text-gray-700 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {drivers.filter(d => d.status === 'pending').map(driver => (
                <tr key={driver._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{driver.firstName} {driver.lastName}</td>
                  <td className="py-3 px-4">{driver.email}</td>
                  <td className="py-3 px-4">{driver.licenseNumber}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => approveDriver(driver._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
