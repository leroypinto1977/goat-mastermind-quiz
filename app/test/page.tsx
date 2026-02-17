'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QUESTIONS } from '@/app/lib/test-config';

function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!code) {
      router.push('/');
    }
  }, [code, router]);

  const handleSelect = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined);

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/submit-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testCode: code,
          answers
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      router.push(`/results?code=${code}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (!code) return null;

  return (
    <div className="min-h-screen p-6 font-sans text-zinc-900 bg-zinc-50 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-8 flex justify-between items-end px-2">
          <h1 className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Assessment</h1>
          <span className="text-xs font-mono font-medium text-zinc-400">{Object.keys(answers).length} / {QUESTIONS.length}</span>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-12 shadow-sm border border-zinc-200">
          <div className="space-y-16">
            {QUESTIONS.map((q, qIndex) => (
              <div key={q.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${qIndex * 100}ms` }}>
                <h2 className="mb-6 text-lg md:text-xl font-bold leading-tight text-zinc-900 tracking-tight">
                  <span className="mr-3 text-zinc-300 font-mono text-sm">0{q.id}</span>
                  {q.text}
                </h2>
                <div className="space-y-3 pl-8">
                  {q.options.map((opt, oIndex) => (
                    <label
                      key={oIndex}
                      className={`group flex cursor-pointer items-start space-x-4 rounded-lg border p-4 transition-all duration-200 ${
                        answers[q.id] === oIndex
                          ? 'border-zinc-900 bg-zinc-900 text-white shadow-md'
                          : 'border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-zinc-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        className="hidden"
                        onChange={() => handleSelect(q.id, oIndex)}
                        checked={answers[q.id] === oIndex}
                      />
                      <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          answers[q.id] === oIndex ? 'border-white bg-white' : 'border-zinc-300 group-hover:border-zinc-400'
                      }`}>
                          {answers[q.id] === oIndex && <div className="h-1.5 w-1.5 rounded-full bg-zinc-900" />}
                      </div>
                      <span className="text-sm font-medium transition-colors">
                        {opt.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-100">
            {error && <p className="mb-4 text-center text-red-600 text-sm font-medium">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="w-full rounded-lg bg-zinc-900 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] shadow-sm"
            >
              {submitting ? 'Calculating...' : 'Submit Assessment'}
            </button>
            <p className="mt-4 text-center text-xs text-zinc-400">
              Answer honestly for accurate results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
            <TestContent />
        </Suspense>
    )
}
