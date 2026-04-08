import { NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateScore, getAuthorityLevel, QUESTIONS } from '@/app/lib/test-config';
import { prisma } from '@/app/lib/prisma';

const schema = z.object({
  userId: z.string().uuid(),
  answers: z.record(z.string(), z.number()),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const { userId, answers } = result.data;

    const user = await prisma.testUser.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.hasTakenTest) {
      return NextResponse.json({ error: 'Test already submitted' }, { status: 403 });
    }

    const answerKeys = Object.keys(answers).map(Number);
    const allAnswered = QUESTIONS.every(q => answerKeys.includes(q.id));

    if (!allAnswered) {
      return NextResponse.json({ error: 'All questions must be answered' }, { status: 400 });
    }

    const numericAnswers: Record<number, number> = {};
    for (const key in answers) {
      numericAnswers[Number(key)] = answers[key];
    }

    const score = calculateScore(numericAnswers);
    const { level } = getAuthorityLevel(score);

    // Tag with the currently open cohort (if any)
    const openCohort = await prisma.cohort.findFirst({ where: { isOpen: true } });

    await prisma.testUser.update({
      where: { id: userId },
      data: {
        score,
        authorityLevel: level,
        answers: answers as any,
        hasTakenTest: true,
        cohortId: openCohort?.id ?? null,
      },
    });

    return NextResponse.json({ success: true, score, authorityLevel: level });
  } catch (error) {
    console.error('Error submitting test:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
