import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiEdit2, FiLoader, FiSave } from 'react-icons/fi';

const UserProfile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || 'Other',
    address: user?.address || {}
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['street', 'city', 'state', 'zipCode'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FiEdit2 /> {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 disabled:cursor-not-allowed outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 disabled:cursor-not-allowed outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 focus:border-blue-500 outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Street</label>
                <input
                  type="text"
                  name="street"
                  value={formData.address?.street || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.address?.city || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.address?.state || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.address?.zipCode || ''}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{user?.totalRides || 0}</p>
                <p className="text-sm text-gray-600">Total Rides</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{user?.rating || 5}★</p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600">₹{user?.walletBalance || 0}</p>
                <p className="text-sm text-gray-600">Wallet Balance</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-orange-600">{user?.isVerified ? '✓' : '✗'}</p>
                <p className="text-sm text-gray-600">Verified</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          {editing && (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FiSave /> Save Changes
                </>
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
