'use client';

import { useState } from 'react';

const OTPVerification = ({ onSuccess, onCancel }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!window.confirmationResult) {
        throw new Error('No confirmation result found. Please try again.');
      }

      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      
      const idToken = await user.getIdToken();
      console.log('ID token: joddddd', idToken);
      onSuccess({ idToken });
    } catch (error) {
      setError('Invalid OTP. Please try again.');
      console.error('OTP verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Enter Verification Code</h2>
      
      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Verification Code
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit code"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            maxLength={6}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full text-blue-500 hover:text-blue-600 focus:outline-none"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default OTPVerification; 