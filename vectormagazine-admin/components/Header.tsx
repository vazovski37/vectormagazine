'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <span className="text-lg font-bold text-white">V</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Vector Magazine</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/editor"
              className="text-sm font-semibold text-gray-900 hover:text-violet-600 transition-colors"
            >
              Editor
            </Link>
            <Link
              href="/articles"
              className="text-sm font-semibold text-gray-900 hover:text-violet-600 transition-colors"
            >
              Articles
            </Link>
            <Link
              href="/categories"
              className="text-sm font-semibold text-gray-900 hover:text-violet-600 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/subscribers"
              className="text-sm font-semibold text-gray-900 hover:text-violet-600 transition-colors"
            >
              Subscribers
            </Link>
          </nav>
        </div>

        {/* User Menu */}
        <div className="relative">
          {!isLoading && user ? (
            <>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user.name}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-gray-200 shadow-lg z-50 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-violet-100 text-violet-700 capitalize">
                        {user.role}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
          )}
        </div>
      </div>
    </header>
  );
}
