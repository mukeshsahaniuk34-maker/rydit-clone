import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiMapPin, FiClock, FiUsers, FiStar, FiArrowRight, FiLoader } from 'react-icons/fi';
import { format } from 'date-fns';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const RideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);

  useEffect(() => {
    fetchRideDetail();
  }, [id]);

  const fetchRideDetail = async () => {
    try {
      // In production, create actual endpoint
      const response = await axios.get(`${API_URL}/rides/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRide(response.data.ride);
    } catch (error) {
      toast.error('Failed to load ride details');
      setTimeout(() => navigate('/search-rides'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async () => {
    if (!selectedSeat) {
      toast.warning('Please select a seat');
      return;
    }

    setBooking(true);
    try {
      const response = await axios.post(
        `${API_URL}/rides/book`,
        {
          rideId: id,
          seatNumber: selectedSeat,
          fare: ride.pricePerSeat
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      toast.success('Ride booked successfully!');
      navigate(`/payment/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <FiLoader className="text-4xl animate-spin text-blue-600 mx-auto" />
        <p className="text-gray-600 mt-4">Loading ride details...</p>
      </div>
    );
  }

  if (!ride) return null;

  const departureTime = new Date(ride.departureTime);
  const occupiedSeats = ride.totalSeats - ride.availableSeats;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {ride.route.replace('-', ' → ').toUpperCase()}
                </h1>
                <p className="text-gray-600">{ride.rideType === 'shared' ? '🚗 Shared Ride' : '🚙 Private Ride'}</p>
              </div>
              <div className="flex items-center gap-1 text-yellow-500">
                <FiStar className="fill-current" />
                <span className="font-semibold text-lg">{ride.driver?.rating || 5}</span>
              </div>
            </div>

            {/* Route */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center gap-3">
                <FiMapPin className="text-blue-600" />
                <span className="text-gray-700">{ride.source.address}</span>
              </div>
              <div className="flex items-center gap-3 ml-6">
                <FiArrowRight className="text-gray-400" />
              </div>
              <div className="flex items-center gap-3">
                <FiMapPin className="text-green-600" />
                <span className="text-gray-700">{ride.destination.address}</span>
              </div>
            </div>
          </div>

          {/* Timing Info */}
          <div className="bg-white rounded-lg shadow-md p-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">DEPARTURE</p>
              <p className="text-2xl font-bold text-gray-800">{format(departureTime, 'HH:mm')}</p>
              <p className="text-xs text-gray-500">{format(departureTime, 'dd MMM yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">DURATION</p>
              <p className="text-2xl font-bold text-gray-800">{ride.duration || '8h'}</p>
              <p className="text-xs text-gray-500">{ride.distance || 0} km</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">SEATS</p>
              <p className="text-2xl font-bold text-gray-800">{ride.availableSeats}/{ride.totalSeats}</p>
              <p className="text-xs text-gray-500">{occupiedSeats} occupied</p>
            </div>
          </div>

          {/* Driver Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Driver Information</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">{ride.driver?.firstName?.[0]}</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {ride.driver?.firstName} {ride.driver?.lastName}
                </p>
                <p className="text-gray-600">Rating: {ride.driver?.rating || 5}★</p>
                <p className="text-gray-600">Total Rides: {ride.driver?.totalRides || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 space-y-6">
            {/* Price */}
            <div>
              <p className="text-sm text-gray-500 mb-2">PRICE PER SEAT</p>
              <p className="text-4xl font-bold text-blue-600">₹{ride.pricePerSeat}</p>
            </div>

            {/* Seat Selection */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">SELECT SEAT</p>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: ride.totalSeats }).map((_, i) => {
                  const seatNum = i + 1;
                  const isOccupied = ride.passengers?.some(p => p.seatNumber === seatNum);
                  const isSelected = selectedSeat === seatNum;

                  return (
                    <button
                      key={seatNum}
                      onClick={() => !isOccupied && setSelectedSeat(seatNum)}
                      disabled={isOccupied}
                      className={`py-3 px-2 rounded-lg font-semibold transition ${
                        isOccupied
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                      }`}
                    >
                      S{seatNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Fare:</span>
                <span className="font-semibold text-gray-800">₹{ride.pricePerSeat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (5%):</span>
                <span className="font-semibold text-gray-800">₹{(ride.pricePerSeat * 0.05).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-bold text-gray-800">Total:</span>
                <span className="font-bold text-blue-600 text-lg">₹{(ride.pricePerSeat * 1.05).toFixed(2)}</span>
              </div>
            </div>

            {/* Book Button */}
            <button
              onClick={handleBookRide}
              disabled={!selectedSeat || booking || ride.availableSeats === 0}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {booking ? (
                <>
                  <FiLoader className="animate-spin" /> Booking...
                </>
              ) : (
                <>Book Seat</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDetail;
