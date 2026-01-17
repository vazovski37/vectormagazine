import Link from 'next/link';
import Header from '@/components/Header';
import { FileText, ArrowRight, Settings } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600">
            <span className="text-2xl font-bold text-white">V</span>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Vector Magazine Admin
          </h1>
          <p className="mt-4 text-lg font-medium text-gray-800">
            Create and manage your articles with ease
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/editor"
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">Create Article</h3>
                <p className="mt-1 text-sm font-medium text-gray-800">Start writing a new article</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </Link>

          <Link
            href="/subscribers"
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-green-300 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">Subscribers</h3>
                <p className="mt-1 text-sm font-medium text-gray-800">Manage newsletter subscribers</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
          </Link>

          <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 shadow-sm opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-600">View Articles</h3>
                <p className="mt-1 text-sm font-medium text-gray-600">Coming soon</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 shadow-sm opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                <Settings className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-600">Settings</h3>
                <p className="mt-1 text-sm font-medium text-gray-600">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
