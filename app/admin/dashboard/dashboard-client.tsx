'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { generateNewCode } from '@/app/admin/actions';

export default function DashboardClient() {
  const [state, formAction, isPending] = useActionState(generateNewCode, null);
  const [showToast, setShowToast] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="relative">
      <form ref={formRef} action={formAction} className="space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            required
            className="w-full bg-white border border-zinc-300 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder-zinc-400"
            placeholder="e.g. John Doe"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">
            Email (Optional)
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full bg-white border border-zinc-300 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder-zinc-400"
            placeholder="john@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-zinc-900 text-white font-bold py-3.5 rounded-lg hover:bg-zinc-800 disabled:opacity-50 transition-all uppercase tracking-wide transform active:scale-[0.99] shadow-sm"
        >
          {isPending ? 'Generating...' : 'Generate Code'}
        </button>
      </form>
        
      {state?.message && !state.success && (
        <div className={`mt-6 p-4 rounded-lg text-sm font-medium border ${state.error ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
          {state.message}
        </div>
      )}

      {state?.success && state.code && (
        <div className="mt-8 p-8 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col items-center animate-in zoom-in duration-500">
            <span className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-3">Generated Code</span>
            <span className="text-5xl font-mono font-black text-zinc-900 tracking-wider mb-6">{state.code}</span>
            <button 
                onClick={() => copyToClipboard(state.code)}
                className="text-xs bg-white hover:bg-zinc-100 border border-zinc-200 px-4 py-2 rounded-full text-zinc-600 font-bold transition-all uppercase tracking-wide hover:border-zinc-300"
            >
                Copy Code
            </button>
        </div>
      )}

      {/* Toast Notification */}
      <div className={`fixed bottom-6 right-6 flex items-center bg-zinc-900 text-white px-5 py-3 rounded-lg shadow-lg transition-all duration-300 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-3 text-zinc-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-bold text-sm tracking-wide">Code Copied</span>
      </div>
    </div>
  );
}
