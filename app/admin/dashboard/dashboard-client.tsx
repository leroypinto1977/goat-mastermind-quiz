'use client';

import { useActionState } from 'react';
import { createAndOpenCohort, closeCohort } from '@/app/admin/actions';

type Cohort = {
  id: string;
  name: string;
  isOpen: boolean;
  openedAt: Date | null;
  closedAt: Date | null;
};

export default function CohortPanel({ activeCohort }: { activeCohort: Cohort | null }) {
  const [state, formAction, isPending] = useActionState(createAndOpenCohort, null);

  return (
    <div>
      {/* Active cohort status */}
      {activeCohort ? (
        <div className="mb-6 p-5 rounded-xl bg-green-50 border border-green-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Active Cohort</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500 text-white uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse" />
              Open
            </span>
          </div>
          <p className="text-base font-black text-zinc-900 tracking-tight">{activeCohort.name}</p>
          {activeCohort.openedAt && (
            <p className="text-xs text-zinc-400 mt-0.5">
              Opened {new Date(activeCohort.openedAt).toLocaleString()}
            </p>
          )}
          <form action={async () => { await closeCohort(activeCohort.id); }} className="mt-4">
            <button
              type="submit"
              className="w-full bg-red-600 text-white text-xs font-bold uppercase tracking-widest py-2.5 rounded-lg hover:bg-red-700 transition-all"
            >
              Close Cohort
            </button>
          </form>
        </div>
      ) : (
        <div className="mb-6 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-300 text-zinc-600 uppercase tracking-wider">
            No Active Cohort
          </span>
        </div>
      )}

      {/* Open new cohort */}
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">
            {activeCohort ? 'Switch to New Cohort' : 'Open New Cohort'}
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            placeholder="e.g. 10 April 2026"
            className="w-full bg-white border border-zinc-300 rounded-lg px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder-zinc-400 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-zinc-900 text-white font-bold py-3 rounded-lg hover:bg-zinc-800 disabled:opacity-50 transition-all uppercase tracking-wide text-xs transform active:scale-[0.99]"
        >
          {isPending ? 'Opening...' : activeCohort ? 'Switch Cohort' : 'Open Cohort'}
        </button>
      </form>

      {state?.message && (
        <div className={`mt-4 p-3 rounded-lg text-xs font-medium border ${state.error ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
          {state.message}
        </div>
      )}
    </div>
  );
}
