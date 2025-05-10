'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, sendSignInLinkToEmail } from 'firebase/auth';

const AuthForm = () => {
  const [input, setInput] = useState('');
  const [isPhone, setIsPhone] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isPhone) {
      setupRecaptcha();
    }
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, [isPhone]);

  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
      }
    });
  };

  const handlePhoneAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!window.recaptchaVerifier) {
        setupRecaptcha();
      }
      const appVerifier = window.recaptchaVerifier;
      await appVerifier.verify();
      console.log('Recaptcha verified');

      const formattedPhone = input.startsWith('+') ? input : `+${input}`;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      window.confirmationResult = confirmationResult;

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('showOTPInput'));
      }
    } catch (error) {
      setError(error.message);
    
      if (error.code === 'auth/invalid-app-credential') {
        const recaptchaContainer = document.getElementById('recaptcha-container');
        if (recaptchaContainer) {
          recaptchaContainer.innerHTML = '';
        }
        
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }
        
        // Force a re-render of the container
        if (recaptchaContainer) {
          recaptchaContainer.style.display = 'none';
          setTimeout(() => {
            recaptchaContainer.style.display = 'block';
            setupRecaptcha();
          }, 1000); // Add a 1-second delay
        }
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a few minutes before trying again.');
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.disabled = true;
          setTimeout(() => {
            submitButton.disabled = false;
            setError('');
          }, 120000); 
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const ActionCodeSettings = {
        url: `${window.location.origin}/success`,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, input, ActionCodeSettings);
      window.localStorage.setItem('emailForSignIn', input);
      console.log('Please check your email for the sign-in link');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPhone) {
      handlePhoneAuth(e);
    } else {
      handleEmailAuth(e);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isPhone ? 'Sign in with Phone' : 'Sign in with Email'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isPhone ? 'Phone Number' : 'Email Address'}
          </label>
          <input
            type={isPhone ? 'tel' : 'email'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isPhone ? '+1234567890' : 'your@email.com'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div id="recaptcha-container"></div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Continue'}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsPhone(!isPhone);
            setInput('');
            setError('');
            if (window.recaptchaVerifier) {
              window.recaptchaVerifier.clear();
              window.recaptchaVerifier = null;
            }
          }}
          className="w-full text-blue-500 hover:text-blue-600 focus:outline-none"
        >
          Try {isPhone ? 'Email' : 'Phone'} instead
        </button>
      </form>
    </div>
  );
};

export default AuthForm; 