'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dictionaryImage from '../assets/images/Dictionary-pana.png';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl flex gap-8">
        {/* Left side - Illustration */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-purple-50 rounded-xl p-6">
          <div className="relative w-full h-80">
            <Image
              src={dictionaryImage}
              alt="Dictionary illustration"
              fill
              style={{ objectFit: 'contain' }}
              priority
              quality={100}
            />
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-center mb-8 text-purple-700">
            Welcome Back to Verb.AI!
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="username" 
                className="block text-lg font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-lg"
                required
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-lg font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-lg"
                required
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Login
            </button>
          </form>

          <p className="mt-8 text-center text-lg">
            Don't have an account?{' '}
            <Link 
              href="/signup" 
              className="text-purple-600 hover:text-purple-700 font-medium underline"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
} 