import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiCreditCard, FiLoader, FiCheck } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Payment = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: ''
  });
  const [amount] = useState(500); // Example amount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const orderResponse = await axios.post(
        `${API_URL}/payments/create-order`,
        {
          rideId,
          amount,
          paymentMethod
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      const { payment } = orderResponse.data;

      // Verify payment (in production, integrate with Razorpay)
      const verifyResponse = await axios.post(
        `${API_URL}/payments/verify`,
        {
          paymentId: payment._id,
          rideId
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      toast.success('Payment successful!');
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-2">1</div>
            <p className="text-sm text-gray-600">Select Seat</p>
          </div>
          <div className="flex-1 h-1 bg-blue-600 mx-2"></div>
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mb-2">2</div>
            <p className="text-sm text-gray-600">Payment</p>
          </div>
          <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
          <div className="text-center">
            <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold mb-2">3</div>
            <p className="text-sm text-gray-600">Confirmation</p>
          </div>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">Complete Payment</h1>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Ride Fare:</span>
              <span className="font-semibold text-gray-800">₹{(amount / 1.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Tax (5%):</span>
              <span className="font-semibold text-gray-800">₹{(amount - amount / 1.05).toFixed(2)}</span>
            </div>
            <div className="border-t pt-4 flex justify-between">
              <span className="font-bold text-gray-800">Total Amount:</span>
              <span className="font-bold text-blue-600 text-2xl">₹{amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Payment Method</label>
            <div className="space-y-2">
              {['card', 'upi', 'netbanking'].map(method => (
                <label key={method} className="flex items-center gap-3 cursor-pointer p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="capitalize font-medium text-gray-700">
                    {method === 'upi' ? 'UPI' : method === 'netbanking' ? 'Net Banking' : 'Credit/Debit Card'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Card Form */}
          {paymentMethod === 'card' && (
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Holder Name</label>
                <input
                  type="text"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry</label>
                  <input
                    type="text"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" /> Processing Payment...
                  </>
                ) : (
                  <>
                    <FiCreditCard /> Pay ₹{amount.toFixed(2)}
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Pay Buttons for Other Methods */}
          {paymentMethod !== 'card' && (
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" /> Processing...
                </>
              ) : (
                <>Pay ₹{amount.toFixed(2)}</>
              )}
            </button>
          )}

          {/* Security Info */}
          <div className="bg-green-50 p-4 rounded-lg flex items-center gap-2 text-green-700 text-sm">
            <FiCheck /> All payments are secure and encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
