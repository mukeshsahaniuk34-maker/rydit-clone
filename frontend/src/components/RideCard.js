import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiUsers, FiStar } from 'react-icons/fi';
import { format } from 'date-fns';

const RideCard = ({ ride }) => {
  const departureTime = new Date(ride.departureTime);
  const occupancyPercentage = ((ride.totalSeats - ride.availableSeats) / ride.totalSeats) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition animate-slideIn">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{ride.route.replace('-', ' → ').toUpperCase()}</h3>
          <p className="text-sm text-gray-500">{ride.rideType === 'shared' ? '🚗 Shared Ride' : '🚙 Private Ride'}</p>
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          <FiStar className="fill-current" />
          <span className="font-semibold">{ride.driver?.rating || 5}</span>
        </div>
      </div>

      {/* Route Details */}
      <div className="space-y-2 mb-4 pb-4 border-b">
        <div className="flex items-center gap-3 text-gray-700">
          <FiMapPin className="text-blue-600" />
          <span className="text-sm">{ride.source.address}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <FiMapPin className="text-green-600" />
          <span className="text-sm">{ride.destination.address}</span>
        </div>
      </div>

      {/* Timing & Info */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div>
          <p className="text-xs text-gray-500">DEPARTURE</p>
          <p className="font-semibold text-gray-800">{format(departureTime, 'HH:mm')}</p>
          <p className="text-xs text-gray-500">{format(departureTime, 'dd MMM')}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">DURATION</p>
          <p className="font-semibold text-gray-800">{ride.duration || '8h'}</p>
          <p className="text-xs text-gray-500">{ride.distance || 0} km</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">SEATS</p>
          <div className="flex items-center justify-center gap-2">
            <FiUsers className="text-blue-600" />
            <p className="font-semibold text-gray-800">{ride.availableSeats}/{ride.totalSeats}</p>
          </div>
        </div>
      </div>

      {/* Occupancy Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${occupancyPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Price & CTA */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">PRICE PER SEAT</p>
          <p className="text-2xl font-bold text-blue-600">₹{ride.pricePerSeat}</p>
        </div>
        <Link
          to={`/ride/${ride._id}`}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RideCard;
