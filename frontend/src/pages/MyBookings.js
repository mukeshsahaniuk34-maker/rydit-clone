import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiLoader, FiTrash2, FiMapPin, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_URL}/rides/my-bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBookings(response.data.rides);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (rideId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setCancelling(rideId);
    try {
      await axios.post(
        `${API_URL}/rides/${rideId}/cancel`,
        { reason: 'User cancelled' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Booking cancelled and refund initiated');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <FiLoader className="text-4xl animate-spin text-blue-600 mx-auto" />
        <p className="text-gray-600 mt-4">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>

      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map(booking => {
            const departureTime = new Date(booking.departureTime);
            const passenger = booking.passengers?.[0];
            
            return (
              <div key={booking._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* Details */}
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-bold text-gray-800">
                      {booking.route.replace('-', ' → ').toUpperCase()}
                    </h3>
                    
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-blue-600" />
                        <span>{booking.source.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-green-600" />
                        <span>{booking.destination.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock />
                        <span>{format(departureTime, 'dd MMM yyyy, HH:mm')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="w-full md:w-auto space-y-2 text-right">
                    <div>
                      <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                        booking.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">₹{passenger?.fare || booking.pricePerSeat}</p>
                    
                    {booking.status === 'scheduled' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancelling === booking._id}
                        className="w-full md:w-auto mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {cancelling === booking._id ? (
                          <>
                            <FiLoader className="animate-spin" /> Cancelling...
                          </>
                        ) : (
                          <>
                            <FiTrash2 /> Cancel Booking
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-xl text-gray-600 mb-4">You haven't booked any rides yet</p>
          <a href="/search-rides" className="text-blue-600 font-semibold hover:underline">
            Browse available rides →
          </a>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
