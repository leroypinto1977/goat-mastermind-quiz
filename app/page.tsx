'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    const newDigits = [...digits];
    pastedData.forEach((digit, i) => {
      newDigits[i] = digit;
    });
    setDigits(newDigits);

    // Focus appropriate input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    // Take the last character entered
    newDigits[index] = value.substring(value.length - 1);
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const code = digits.join('');

    if (code.length !== 6) {
      setError('Please enter the full 6-digit code.');
      // Shake animation trigger?
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/validate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testCode: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (data.valid) {
        if (data.taken) {
          router.push(`/results?code=${code}`);
        } else {
          router.push(`/test?code=${code}`);
        }
      } else {
        setError('Invalid code. Please check and try again.');
        setLoading(false); // Stop loading if invalid
      }
    } catch (err: any) {
      setError(err.message || 'Failed to validate code.');
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-50 font-sans text-zinc-900">
      <div className="w-full max-w-md bg-white p-12 rounded-2xl shadow-sm border border-zinc-200 animate-in fade-in zoom-in duration-500">
        <h1 className="mb-3 text-3xl font-black tracking-tighter text-zinc-900 sm:text-5xl text-center">
          WOULD YOU <br /> PAY YOU?
        </h1>
        <p className="mb-10 text-zinc-500 font-medium text-center text-sm tracking-wide uppercase">
          Discover your true authority level.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-8">
          <div className="flex justify-center gap-2 sm:gap-3">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                className="w-10 h-12 sm:w-12 sm:h-14 bg-white border border-zinc-200 rounded-lg text-center text-xl sm:text-2xl font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder-transparent shadow-sm"
                autoFocus={i === 0}
              />
            ))}
          </div>

          {error && <p className="text-sm font-medium text-red-600 text-center animate-in fade-in bg-red-50 py-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={loading || digits.join('').length !== 6}
            className="w-full rounded-lg bg-zinc-900 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-zinc-800 disabled:opacity-50 transition-all disabled:cursor-not-allowed transform active:scale-[0.98] shadow-md"
          >
            {loading ? 'Validating...' : 'Begin Assessment'}
          </button>
        </form>

        <div className="mt-12 flex items-center justify-center space-x-3 opacity-40">
          <div className="h-px w-8 bg-zinc-300"></div>
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Goat Mastermind</span>
          <div className="h-px w-8 bg-zinc-300"></div>
        </div>
      </div>
    </main>
  );
}
