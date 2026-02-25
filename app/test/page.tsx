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

  const [isStarted, setIsStarted] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    if (!code) {
      router.push('/');
    }
  }, [code, router]);

  // Show button immediately on page load
  useEffect(() => {
    if (!isStarted) {
      setIntroFinished(true); // Fire instantly
    }
  }, [isStarted]);

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

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 sm:p-12 font-sans overflow-hidden">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-12 sm:space-y-16">
          <p
            className="text-lg sm:text-2xl text-zinc-400 font-medium tracking-wide animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both"
            style={{ animationDelay: '500ms' }}
          >
            Before people buy from you…
          </p>

          <p
            className="text-2xl sm:text-4xl text-zinc-300 font-semibold tracking-tight animate-in fade-in zoom-in-95 duration-1000 fill-mode-both"
            style={{ animationDelay: '2000ms' }}
          >
            they decide something first.
          </p>

          <p
            className="text-3xl sm:text-5xl lg:text-6xl text-white font-black tracking-tighter italic px-4 py-8 relative animate-in fade-in duration-1000 fill-mode-both"
            style={{ animationDelay: '4000ms' }}
          >
            <span
              className="text-zinc-700 absolute -top-4 -left-4 sm:-top-8 sm:-left-8 text-6xl sm:text-9xl font-serif animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-both"
              style={{ animationDelay: '4200ms' }}
            >
              "
            </span>
            Is this person worth paying?
            <span
              className="text-zinc-700 absolute -bottom-10 -right-4 sm:-bottom-16 sm:-right-8 text-6xl sm:text-9xl font-serif animate-in slide-in-from-top-8 fade-in duration-1000 fill-mode-both"
              style={{ animationDelay: '4400ms' }}
            >
              "
            </span>
          </p>

          <p
            className="text-lg sm:text-xl text-zinc-500 font-medium uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-1000 fill-mode-both"
            style={{ animationDelay: '6000ms' }}
          >
            Most entrepreneurs never check this.
          </p>

          <div
            className={`mt-16 transition-all duration-1000 ease-in-out ${introFinished ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          >
            <button
              onClick={() => setIsStarted(true)}
              className="bg-white text-zinc-950 px-12 py-5 rounded-full text-sm sm:text-base font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              Begin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 font-sans text-zinc-900 bg-zinc-50 flex items-center justify-center fade-in duration-700 animate-in">
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-8 flex justify-between items-end px-2">
          <h1 className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Assessment</h1>
          <span className="text-xs font-mono font-medium text-zinc-400">{Object.keys(answers).length} / {QUESTIONS.length}</span>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-12 shadow-sm border border-zinc-200">
          <div className="space-y-16">
            {QUESTIONS.map((q, qIndex) => (
              <div key={q.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: `${qIndex * 150}ms` }}>
                <h2 className="mb-6 text-lg md:text-xl font-bold leading-tight text-zinc-900 tracking-tight">
                  <span className="mr-3 text-zinc-300 font-mono text-sm">0{q.id}</span>
                  {q.text}
                </h2>
                <div className="space-y-3 pl-8">
                  {q.options.map((opt, oIndex) => (
                    <label
                      key={oIndex}
                      className={`group flex cursor-pointer items-start space-x-4 rounded-lg border p-4 transition-all duration-200 ${answers[q.id] === oIndex
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
                      <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${answers[q.id] === oIndex ? 'border-white bg-white' : 'border-zinc-300 group-hover:border-zinc-400'
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
            {error && <p className="mb-4 text-center text-red-600 text-sm font-medium animate-in fade-in px-4 py-2 bg-red-50 rounded-lg">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="w-full rounded-lg bg-zinc-900 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] shadow-sm relative overflow-hidden"
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </span>
              ) : 'Submit Assessment'}
            </button>
            <p className="mt-4 text-center text-xs text-zinc-400 font-medium">
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
