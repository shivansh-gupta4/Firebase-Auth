'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthSuccessPage() {
  const router = useRouter();

  const handleGoToAuth = useCallback(() => {
    // Only clear specific items
    window.localStorage.removeItem('emailForSignIn');
    window.localStorage.removeItem('authToken');
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    window.confirmationResult = null;
    router.push('/auth');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Authentication Successful!</h1>
        <p className="text-gray-700 mb-6">You have successfully signed in with your phone number.</p>
        <button
          onClick={handleGoToAuth}
          className="inline-block px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Go to Auth
        </button>
      </div>
    </div>
  );
} 