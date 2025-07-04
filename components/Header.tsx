'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --- CHANGE 1: Reverted to the original dark background color ---
  return (
   <header
  style={{ backgroundColor: '#02343F', color: '#F0EDCC' }}
  className="shadow-lg sticky top-0 z-50"
>

      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-bold tracking-wider">
          CBU-Bank
        </Link>

    {/* Profile / Login Button */}
    <div className="flex items-center space-x-4">
      {isAuthenticated && user ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img src={user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-gray-500" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            // Dropdown now has a dark theme to match
            <div className="absolute right-0 mt-2 w-56 bg-gray-700 text-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
              <div className="px-4 py-3 border-b border-gray-600">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-sm text-gray-400 truncate">{user.email}</p>
              </div>
              <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-600">
                Your Profile
              </Link>
              <Link href="/settings" className="block px-4 py-2 text-sm hover:bg-gray-600">
                Settings
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link href="/login" className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 transition-colors">
          Login
        </Link>
      )}

      {/* Mobile Menu Button is now conditional */}
      {isAuthenticated && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-700 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      )}
    </div>
  </div>
</header>
  );
};

export default Header;