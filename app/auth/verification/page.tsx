'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Verification() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleResendEmail = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      // Get the email from localStorage if available
      const email = localStorage.getItem('signupEmail');
      
      if (!email) {
        throw new Error('Email not found. Please try signing up again.');
      }
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) {
        if (error.message.includes('rate_limit') || error.status === 429) {
          throw new Error('Please wait before requesting another email.');
        }
        throw error;
      }
      
      setMessage({
        type: 'success',
        text: 'Verification email has been resent. Please check your inbox.'
      });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to resend verification email.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <Image
            src="https://freecoins24.io/wp-content/uploads/2024/07/dtxm4BGB_400x400.jpg"
            alt="Vectorium"
            width={80}
            height={80}
            className="rounded-full"
          />
        </Link>
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Check your email
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Verification email sent</h3>
          <p className="text-sm text-gray-600 mb-6">
            We've sent a verification email to your address. Please check your inbox and click the verification link to complete your registration.
          </p>
          
          {message && (
            <div className={`mb-6 p-3 rounded-md text-sm ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
          
          <div className="mt-6 flex flex-col space-y-4">
            <Link
              href="/auth/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Go to login
            </Link>
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70"
            >
              {loading ? 'Sending...' : 'Resend verification email'}
            </button>
          </div>
        </div>
      </div>

      <Link href="/" className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>
    </div>
  );
}