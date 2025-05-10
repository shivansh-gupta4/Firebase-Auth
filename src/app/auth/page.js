'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import OTPVerification from '@/components/auth/OTPVerification';

export default function AuthPage() {
  const [showOTP, setShowOTP] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleShowOTP = () => setShowOTP(true);
    window.addEventListener('showOTPInput', handleShowOTP);
    
    return () => {
      window.removeEventListener('showOTPInput', handleShowOTP);
    };
  }, []);

  const handleAuthSuccess = ({ idToken }) => {
    localStorage.setItem('authToken', idToken);
    document.cookie = `authToken=${idToken}; path=/; max-age=86400;`;
    console.log('Auth success');
    router.push('/auth-success');
  };

  const handleCancelOTP = () => {
    setShowOTP(false);
    window.confirmationResult = null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {showOTP ? (
        <OTPVerification
          onSuccess={handleAuthSuccess}
          onCancel={handleCancelOTP}
        />
      ) : (
        <AuthForm />
      )}
    </div>
  );
} 