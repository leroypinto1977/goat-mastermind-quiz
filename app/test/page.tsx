'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QUESTIONS } from '@/app/lib/test-config';

function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('id');

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transitionStage, setTransitionStage] = useState<'in' | 'out'>('in');
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const navigateQuestion = (nextIndex: number, direction: 'forward' | 'backward') => {
    if (nextIndex < 0 || nextIndex >= QUESTIONS.length || transitionStage === 'out') return;
    setTransitionDirection(direction);
    setTransitionStage('out');

    transitionTimeoutRef.current = setTimeout(() => {
      setCurrentQuestionIndex(nextIndex);
      setTransitionStage('in');
    }, 170);
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const isCurrentAnswered = answers[currentQuestion.id] !== undefined;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;
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
          userId: code,
          answers
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      router.push(`/results?id=${code}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (!code) return null;

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-[#1d3866] flex flex-col items-center justify-center p-6 sm:p-12 font-sans overflow-hidden">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-12 sm:space-y-16">
          <p
            className="text-lg sm:text-2xl text-[#d59f81] font-medium tracking-wide animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both"
            style={{ animationDelay: '500ms' }}
          >
            Before people buy from you…
          </p>

          <p
            className="text-2xl sm:text-4xl text-[#f5c8ad] font-semibold tracking-tight animate-in fade-in zoom-in-95 duration-1000 fill-mode-both"
            style={{ animationDelay: '2000ms' }}
          >
            they decide something first.
          </p>

          <p
            className="text-3xl sm:text-5xl lg:text-6xl text-[#ffefe6] font-black tracking-tighter italic px-4 py-8 relative animate-in fade-in duration-1000 fill-mode-both"
            style={{ animationDelay: '4000ms' }}
          >
            <span
              className="text-[#5a6f95] absolute -top-4 -left-4 sm:-top-8 sm:-left-8 text-6xl sm:text-9xl font-serif animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-both"
              style={{ animationDelay: '4200ms' }}
            >
              "
            </span>
            Is this person worth paying?
            <span
              className="text-[#5a6f95] absolute -bottom-10 -right-4 sm:-bottom-16 sm:-right-8 text-6xl sm:text-9xl font-serif animate-in slide-in-from-top-8 fade-in duration-1000 fill-mode-both"
              style={{ animationDelay: '4400ms' }}
            >
              "
            </span>
          </p>

          <p
            className="text-lg sm:text-xl text-[#d59f81] font-medium uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-1000 fill-mode-both"
            style={{ animationDelay: '6000ms' }}
          >
            Most entrepreneurs never check this.
          </p>

          <div
            className={`mt-16 transition-all duration-1000 ease-in-out ${introFinished ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          >
            <button
              onClick={() => setIsStarted(true)}
              className="bg-[#ffefe6] text-[#1d3866] px-12 py-5 rounded-full text-sm sm:text-base font-bold uppercase tracking-[0.2em] hover:bg-[#f9d4bf] transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.14)]"
            >
              Begin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 font-sans text-[#1d3866] bg-[#ffefe6] flex items-center justify-center fade-in duration-700 animate-in">
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-8 flex justify-between items-end px-2">
          <h1 className="text-xs font-bold tracking-widest text-[#6f82a5] uppercase">Assessment</h1>
          <span className="text-xs font-mono font-medium text-[#6f82a5]">{Object.keys(answers).length} / {QUESTIONS.length}</span>
        </div>

        <div className="bg-[#fff6f0] rounded-2xl p-6 md:p-12 shadow-[0_10px_40px_rgba(24,24,27,0.08)] border border-[#f9d4bf]">
          <div className="mb-4">
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#6f82a5]">
              Question {currentQuestionIndex + 1} of {QUESTIONS.length}
            </p>
          </div>

          <div
            className={`transition-all duration-200 ease-out ${transitionStage === 'out'
              ? transitionDirection === 'forward'
                ? 'opacity-0 -translate-x-3'
                : 'opacity-0 translate-x-3'
              : 'opacity-100 translate-x-0'
              }`}
          >
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="mb-6 text-lg md:text-xl font-bold leading-tight text-[#1d3866] tracking-tight">
                <span className="mr-3 text-[#d59f81] font-mono text-sm">0{currentQuestion.id}</span>
                {currentQuestion.text}
              </h2>
              <div className="space-y-3 pl-8">
                {currentQuestion.options.map((opt, oIndex) => (
                  <label
                    key={oIndex}
                    className={`group flex cursor-pointer items-start space-x-4 rounded-lg border p-4 transition-all duration-200 ${answers[currentQuestion.id] === oIndex
                      ? 'border-[#1d3866] bg-[#1d3866] text-white shadow-md'
                      : 'border-[#f9d4bf] bg-[#fff6f0] hover:bg-[#ffefe6] hover:border-[#f5c8ad] text-[#5a6f95]'
                      }`}
                  >
                    <input
                      type="radio"
                      name={`q-${currentQuestion.id}`}
                      className="hidden"
                      onChange={() => handleSelect(currentQuestion.id, oIndex)}
                      checked={answers[currentQuestion.id] === oIndex}
                    />
                    <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${answers[currentQuestion.id] === oIndex ? 'border-white bg-white' : 'border-[#f5c8ad] group-hover:border-[#d59f81]'
                      }`}>
                      {answers[currentQuestion.id] === oIndex && <div className="h-1.5 w-1.5 rounded-full bg-[#1d3866]" />}
                    </div>
                    <span className="text-sm font-medium transition-colors">
                      {opt.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#fde3d4]">
            {error && <p className="mb-4 text-center text-[#5a6f95] text-sm font-medium animate-in fade-in px-4 py-2 bg-[#fde3d4] rounded-lg">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => navigateQuestion(currentQuestionIndex - 1, 'backward')}
                disabled={isFirstQuestion || submitting}
                className="flex-1 rounded-lg border border-[#f9d4bf] bg-[#fff6f0] py-4 text-sm font-bold uppercase tracking-widest text-[#1d3866] hover:bg-[#ffefe6] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Back
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitting}
                  className="w-2/3 rounded-lg bg-[#1d3866] py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-[#2a4a7f] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] shadow-sm relative overflow-hidden"
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
              ) : (
                <button
                  onClick={() => navigateQuestion(currentQuestionIndex + 1, 'forward')}
                  disabled={!isCurrentAnswered || submitting}
                  className="flex-1 rounded-lg bg-[#1d3866] py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-[#2a4a7f] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] shadow-sm"
                >
                  Next
                </button>
              )}
            </div>
            <p className="mt-4 text-center text-xs text-[#6f82a5] font-medium">
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
    <Suspense fallback={<div className="min-h-screen bg-[#ffefe6] flex items-center justify-center text-[#6f82a5]">Loading...</div>}>
      <TestContent />
    </Suspense>
  )
}
