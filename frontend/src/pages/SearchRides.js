import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import RideCard from '../components/RideCard';
import { FiSearch, FiLoader } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const SearchRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    date: '',
    rideType: 'all'
  });

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/rides/available`, {
        params: {
          date: filters.date
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRides(response.data.rides);
    } catch (error) {
      toast.error('Failed to fetch rides');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRides();
  };

  // Filter rides based on type
  const filteredRides = filters.rideType === 'all' 
    ? rides 
    : rides.filter(ride => ride.rideType === filters.rideType);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          {/* Date Filter */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Ride Type Filter */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ride Type</label>
            <select
              name="rideType"
              value={filters.rideType}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Rides</option>
              <option value="shared">Shared Ride</option>
              <option value="private">Private Ride</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" /> Searching...
                </>
              ) : (
                <>
                  <FiSearch /> Search
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Rides List */}
      {loading ? (
        <div className="text-center py-12">
          <FiLoader className="text-4xl animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600 mt-4">Loading rides...</p>
        </div>
      ) : filteredRides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRides.map(ride => (
            <RideCard key={ride._id} ride={ride} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-xl text-gray-600">No rides found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default SearchRides;
