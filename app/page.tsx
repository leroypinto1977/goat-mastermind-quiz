'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!mobileNumber.trim()) {
      setError('Please enter your mobile number.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/start-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: fullName.trim(), mobileNumber: mobileNumber.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (data.taken) {
        router.push(`/results?id=${data.userId}`);
      } else {
        router.push(`/test?id=${data.userId}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#ffefe6] font-sans text-[#1d3866]">
      <div className="w-full max-w-md bg-[#fff6f0] p-12 rounded-2xl shadow-[0_10px_40px_rgba(24,24,27,0.08)] border border-[#f9d4bf] animate-in fade-in zoom-in duration-500">
        <h1 className="mb-3 text-3xl font-black tracking-tighter text-[#1d3866] sm:text-5xl text-center">
          WOULD YOU <br /> PAY YOU?
        </h1>
        <p className="mb-10 text-[#6f82a5] font-medium text-center text-sm tracking-wide uppercase">
          Discover your true authority level.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="fullName" className="text-xs font-bold text-[#6f82a5] uppercase tracking-wide">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-[#fff6f0] border border-[#f9d4bf] rounded-lg px-4 py-3 text-[#1d3866] focus:outline-none focus:ring-2 focus:ring-[#1d3866]/15 focus:border-[#1d3866] transition-all placeholder-[#d59f81] shadow-sm"
              autoFocus
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="mobileNumber" className="text-xs font-bold text-[#6f82a5] uppercase tracking-wide">
              Mobile Number
            </label>
            <input
              id="mobileNumber"
              type="tel"
              value={mobileNumber}
              onChange={e => setMobileNumber(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full bg-[#fff6f0] border border-[#f9d4bf] rounded-lg px-4 py-3 text-[#1d3866] focus:outline-none focus:ring-2 focus:ring-[#1d3866]/15 focus:border-[#1d3866] transition-all placeholder-[#d59f81] shadow-sm"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-[#5a6f95] text-center animate-in fade-in bg-[#fde3d4] py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#1d3866] py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-[#2a4a7f] disabled:opacity-50 transition-all disabled:cursor-not-allowed transform active:scale-[0.98] shadow-md mt-4"
          >
            {loading ? 'Starting...' : 'Begin Assessment'}
          </button>
        </form>

        <div className="mt-12 flex items-center justify-center space-x-3 opacity-40">
          <div className="h-px w-8 bg-[#f9d4bf]"></div>
          <span className="text-[10px] text-[#6f82a5] uppercase tracking-widest font-bold">Goat Mastermind</span>
          <div className="h-px w-8 bg-[#f9d4bf]"></div>
        </div>
      </div>
    </main>
  );
}
