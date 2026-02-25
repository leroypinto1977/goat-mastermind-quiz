import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { prisma } from '@/app/lib/prisma';

// const prisma = new PrismaClient(); // Removed


async function getResult(code: string) {
  const user = await prisma.testUser.findUnique({
    where: { testCode: code },
  });
  return user;
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> // Next.js 15 requires awaiting searchParams
}) {
  const { code } = await searchParams;

  if (!code || typeof code !== 'string') {
    redirect('/');
  }

  const user = await getResult(code);

  if (!user || !user.hasTakenTest || user.score === null) {
    redirect('/');
  }

  // Determine messaging based on logic (in case we need dynamic data not stored in DB)
  // But we stored authorityLevel in DB, so we can use that.

  let description = "";
  if (user.score <= 40) {
    description = "You’re skilled, but replaceable. The market doesn’t see enough reason to choose you.";
  } else if (user.score <= 70) {
    description = "People trust you, but not enough to pay premium. One positioning shift can change your income.";
  } else {
    description = "You’re already perceived as an expert. Now you need a system to scale demand and pricing.";
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-zinc-900 font-sans bg-zinc-50">
      <div className="w-full max-w-lg text-center p-12 rounded-2xl animate-in fade-in zoom-in duration-500 shadow-sm border border-zinc-200 bg-white">
        <div className="mb-8 inline-block rounded-full bg-zinc-100 px-4 py-1.5 text-[10px] font-bold text-zinc-500 tracking-widest uppercase border border-zinc-200">
          Assessment Complete
        </div>

        <h1 className="mb-2 text-6xl sm:text-8xl font-black tracking-tighter text-zinc-900">
          {user.score}<span className="text-2xl sm:text-3xl text-zinc-300 font-normal ml-2">/100</span>
        </h1>

        <h2 className="mb-10 text-xl font-bold uppercase tracking-widest text-zinc-900">
          {user.authorityLevel}
        </h2>

        <div className="mx-auto mb-10 h-px w-24 bg-zinc-200"></div>

        <p className="mb-10 text-lg leading-relaxed text-zinc-600 font-medium">
          {description}
        </p>

        <div className="mb-12 rounded-lg bg-zinc-50 p-6 border border-zinc-100">
          <p className="text-sm text-zinc-500 italic font-medium">
            "Most people with your score struggle not because of skill — but because the market doesn’t fully trust them yet."
          </p>
        </div>

        <a
          href="https://tidycal.com/3qgpjv1/growth-mapping-call"
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center w-full rounded-lg bg-zinc-900 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-zinc-800 transition-all transform active:scale-[0.99] shadow-sm"
        >
          Book Authority Mapping Call
        </a>

        <div className="mt-8">
          <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest font-bold border-b border-transparent hover:border-zinc-900">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
