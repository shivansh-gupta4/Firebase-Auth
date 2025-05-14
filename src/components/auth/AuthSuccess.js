'use client';

import { useCallback } from 'react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function AuthSuccess() {

  const handleSignOut = useCallback(async () => {
    try {
     
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      window.confirmationResult = null;
      
      await signOut(auth);
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Authentication Successful!</h1>
        <p className="text-gray-700 mb-6">You have successfully signed in.</p>
        <button
          onClick={handleSignOut}
          className="inline-block px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}