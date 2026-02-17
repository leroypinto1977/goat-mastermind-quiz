'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 font-sans">
      <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-sm border border-zinc-200">
        <div className="flex flex-col items-center mb-8">
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Admin Portal</h1>
            <p className="text-zinc-500 mt-2 text-sm font-medium">Sign in to manage tests and users</p>
        </div>
        <form action={dispatch} className="flex flex-col space-y-5">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wide mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder-zinc-400"
              id="email"
              type="email"
              name="email"
              placeholder="admin@goat.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wide mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-4 py-3 bg-white border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder-zinc-400"
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <p className="text-sm text-red-600 font-medium bg-red-50 px-3 py-1 rounded w-full text-center">{errorMessage}</p>
            )}
          </div>
          <button
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide transform active:scale-[0.99] shadow-sm"
            aria-disabled={isPending}
            disabled={isPending}
          >
           {isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
