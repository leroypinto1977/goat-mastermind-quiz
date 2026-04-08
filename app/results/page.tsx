import { redirect } from 'next/navigation';
import Link from 'next/link';

import { prisma } from '@/app/lib/prisma';

async function getResult(id: string) {
  const user = await prisma.testUser.findUnique({
    where: { id },
  });
  return user;
}

function getScorePalette(score: number) {
  if (score <= 40) {
    return {
      tier: 'Low Authority Signal',
      primary: '#B42318',
      secondary: '#F04438',
      soft: '#FEE4E2',
      glow: 'rgba(180,35,24,0.30)',
    };
  }

  if (score <= 70) {
    return {
      tier: 'Developing Authority',
      primary: '#D9481C',
      secondary: '#F97316',
      soft: '#FFE4D5',
      glow: 'rgba(217,72,28,0.30)',
    };
  }

  return {
    tier: 'Strong Authority Signal',
    primary: '#EA580C',
    secondary: '#FB923C',
    soft: '#FFE7D6',
    glow: 'rgba(234,88,12,0.30)',
  };
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await searchParams;

  if (!id || typeof id !== 'string') {
    redirect('/');
  }

  const user = await getResult(id);

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

  const palette = getScorePalette(user.score);
  const scoreDegrees = Math.max(0, Math.min(360, Math.round((user.score / 100) * 360)));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-[#1d3866] font-sans bg-[#ffefe6]">
      <div className="group relative w-full max-w-2xl rounded-[28px] border border-[#f9d4bf]/80 bg-white/70 p-8 sm:p-12 text-center shadow-[0_10px_40px_rgba(24,24,27,0.10)] backdrop-blur-xl animate-in fade-in zoom-in duration-500 overflow-hidden">

        <div className="relative z-10 mb-8 inline-block rounded-full bg-[#fde3d4] px-4 py-1.5 text-[10px] font-bold text-[#6f82a5] tracking-widest uppercase border border-[#f9d4bf]">
          Assessment Complete
        </div>

        <div className="relative z-10 mb-8 mx-auto w-fit">
          <div
            className="score-ring-loop h-52 w-52 sm:h-60 sm:w-60 rounded-full p-3 shadow-[0_20px_40px_rgba(0,0,0,0.10)]"
            style={{
              background: `conic-gradient(${palette.primary} 0deg ${scoreDegrees}deg, #f8ded0 ${scoreDegrees}deg 360deg)`,
              boxShadow: `0 20px 48px ${palette.glow}`,
              animation: 'score-ring-loop 2.6s ease-in-out infinite',
            }}
          >
            <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-white/60 bg-white/70 backdrop-blur-lg">
              <p
                className="text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: palette.primary }}
              >
                Score
              </p>
              <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-[#1d3866] leading-none">
                {user.score}
              </h1>
              <span className="text-sm font-semibold tracking-wider text-[#6f82a5]">/100</span>
            </div>
          </div>
        </div>

        <h2 className="relative z-10 mb-3 text-xl font-bold uppercase tracking-widest text-[#1d3866]">
          {user.authorityLevel}
        </h2>
        <p
          className="relative z-10 mb-8 text-xs sm:text-sm font-bold uppercase tracking-[0.16em]"
          style={{ color: palette.primary }}
        >
          {palette.tier}
        </p>

        <div className="relative z-10 mb-10">
          <div className="mx-auto h-3 w-full max-w-md rounded-full bg-[#f8ded0] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${user.score}%`,
                background: `linear-gradient(90deg, ${palette.primary} 0%, ${palette.secondary} 100%)`,
              }}
            />
          </div>
          <div className="mx-auto mt-2 flex w-full max-w-md justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-[#6f82a5]">
            <span>Low</span>
            <span>Mid</span>
            <span>High</span>
          </div>
        </div>

        <p className="relative z-10 mb-10 text-lg leading-relaxed text-[#5a6f95] font-medium">
          {description}
        </p>

        <div className="relative z-10 mb-12 rounded-lg bg-[#ffefe6]/75 backdrop-blur-md p-6 border border-[#f9d4bf]">
          <p className="text-sm text-[#6f82a5] italic font-medium">
            &ldquo;Most people with your score struggle not because of skill but because the market doesn&rsquo;t fully trust them yet.&rdquo;
          </p>
        </div>

        <a
          href="https://tidycal.com/3qgpjv1/growth-mapping-call"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 flex justify-center w-full rounded-lg bg-[#1d3866] py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-[#2a4a7f] transition-all transform active:scale-[0.99] shadow-sm"
        >
          Book Authority Mapping Call
        </a>

        <div className="relative z-10 mt-8">
          <Link href="/" className="text-xs text-[#6f82a5] hover:text-[#1d3866] transition-colors uppercase tracking-widest font-bold border-b border-transparent hover:border-[#1d3866]">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
