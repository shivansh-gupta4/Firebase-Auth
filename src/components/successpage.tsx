'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        try {
          const email = window.localStorage.getItem('emailForSignIn');
          if (!email) {
            throw new Error('Email is required to complete sign-in');
          }
          
          await signInWithEmailLink(auth, email, window.location.href);
          const user = auth.currentUser;
          if (user) {
            const idToken = await user.getIdToken();
            document.cookie = `authToken=${idToken}; path=/`;
          }
          window.localStorage.removeItem('emailForSignIn');
          router.push('/auth-success');
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unexpected error occurred during sign-in');
          }
        } finally {
          setLoading(false);
        }
      } else {
        setError('Invalid or expired sign-in link');
        setLoading(false);
      }
    };

    handleEmailLink();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Verifying your sign-in...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return null;
} 