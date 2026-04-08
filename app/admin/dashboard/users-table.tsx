'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QUESTIONS } from '@/app/lib/test-config';

type Cohort = {
  id: string;
  name: string;
  isOpen: boolean;
};

type User = {
  id: string;
  fullName: string;
  mobileNumber: string;
  hasTakenTest: boolean;
  score: number | null;
  authorityLevel: string | null;
  answers: unknown;
  cohort: Cohort | null;
  createdAt: Date;
};

function AnswerModal({ user, onClose }: { user: User; onClose: () => void }) {
  const answers = (user.answers && typeof user.answers === 'object' && !Array.isArray(user.answers))
    ? user.answers as Record<string, number>
    : null;

  const authorityColor =
    user.score !== null && user.score > 70
      ? 'text-green-700 bg-green-50 border-green-200'
      : user.score !== null && user.score > 40
      ? 'text-yellow-700 bg-yellow-50 border-yellow-200'
      : 'text-red-700 bg-red-50 border-red-200';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-zinc-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-zinc-900">{user.fullName}</h2>
            <p className="text-sm text-zinc-400 font-mono mt-0.5">{user.mobileNumber}</p>
          </div>
          <div className="flex items-center gap-3">
            {user.score !== null && (
              <div className="text-right">
                <div className="text-3xl font-black text-zinc-900 tracking-tighter leading-none">{user.score}</div>
                <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">/100</div>
              </div>
            )}
            {user.authorityLevel && (
              <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${authorityColor}`}>
                {user.authorityLevel}
              </span>
            )}
            <button
              onClick={onClose}
              className="ml-2 text-zinc-400 hover:text-zinc-900 transition-colors p-1 rounded-lg hover:bg-zinc-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cohort badge */}
        {user.cohort && (
          <div className="px-8 py-3 bg-zinc-50 border-b border-zinc-100 flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Cohort</span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${user.cohort.isOpen ? 'bg-green-50 text-green-700 border-green-100' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
              {user.cohort.name}
            </span>
          </div>
        )}

        {/* Questions & Answers */}
        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-6">
          {answers ? (
            QUESTIONS.map((q) => {
              const selectedIndex = answers[String(q.id)];
              return (
                <div key={q.id}>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                    <span className="font-mono mr-2">0{q.id}</span>{q.text}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, i) => {
                      const isSelected = selectedIndex === i;
                      return (
                        <div
                          key={i}
                          className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm transition-colors ${
                            isSelected
                              ? 'bg-zinc-900 border-zinc-900 text-white'
                              : 'bg-zinc-50 border-zinc-100 text-zinc-400'
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-white' : 'border-zinc-300'}`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div className="flex-1">
                            <span className={`font-medium ${isSelected ? 'text-white' : 'text-zinc-400'}`}>{opt.text}</span>
                            {isSelected && (
                              <span className="ml-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                +{opt.points} pts
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-zinc-400 py-8">This user has not completed the assessment yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UsersTable({
  users,
  activeCohortId,
}: {
  users: User[];
  activeCohortId: string | null;
}) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Live refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 10000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 border-b border-zinc-100">
            <tr>
              <th className="p-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Date</th>
              <th className="p-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Name</th>
              <th className="p-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Mobile</th>
              <th className="p-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Cohort</th>
              <th className="p-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Status</th>
              <th className="p-5 text-xs font-bold text-zinc-400 uppercase tracking-wider text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.map((user) => (
              <tr
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className="hover:bg-zinc-50 transition-colors cursor-pointer group"
              >
                <td className="p-5 text-sm text-zinc-500 font-mono">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-5">
                  <div className="font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors">{user.fullName}</div>
                </td>
                <td className="p-5">
                  <span className="font-mono text-xs text-zinc-500">{user.mobileNumber}</span>
                </td>
                <td className="p-5">
                  {user.cohort ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.cohort.isOpen ? 'bg-green-50 text-green-700 border-green-100' : 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
                      {user.cohort.name}
                    </span>
                  ) : (
                    <span className="text-zinc-300 text-xs font-mono">—</span>
                  )}
                </td>
                <td className="p-5">
                  {user.hasTakenTest ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
                      Pending
                    </span>
                  )}
                </td>
                <td className="p-5 text-right font-mono font-bold text-zinc-900">
                  {user.score !== null ? user.score : '—'}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-zinc-400">
                  No test takers yet. Share the link to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <AnswerModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </>
  );
}
