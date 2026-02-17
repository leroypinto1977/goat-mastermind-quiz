import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { calculateScore, getAuthorityLevel, QUESTIONS } from '@/app/lib/test-config';

import { prisma } from '@/app/lib/prisma';

// const prisma = new PrismaClient(); // Removed


const schema = z.object({
  testCode: z.string().length(6).regex(/^\d+$/),
  answers: z.record(z.string(), z.number()), // map of questionId -> optionIndex
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const { testCode, answers } = result.data;

    // Validate code and check if already taken
    const user = await prisma.testUser.findUnique({
      where: { testCode },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
    }

    if (user.hasTakenTest) {
      return NextResponse.json({ error: 'Test already taken' }, { status: 403 });
    }

    // Validate that all questions are answered
    const answerKeys = Object.keys(answers).map(Number);
    const allAnswered = QUESTIONS.every(q => answerKeys.includes(q.id));
    
    if (!allAnswered) {
        return NextResponse.json({ error: 'All questions must be answered' }, { status: 400 });
    }

    // Calculate score server-side
    // Convert string keys to number for valid calculation type check
    const numericAnswers: Record<number, number> = {};
    for (const key in answers) {
        numericAnswers[Number(key)] = answers[key];
    }
    
    const score = calculateScore(numericAnswers);
    const { level } = getAuthorityLevel(score);

    // Update user in DB
    const updatedUser = await prisma.testUser.update({
      where: { testCode },
      data: {
        score,
        authorityLevel: level,
        answers: answers as any, // Json type
        hasTakenTest: true,
      },
    });

    return NextResponse.json({ 
        success: true,
        score,
        authorityLevel: level
    });

  } catch (error) {
    console.error('Error submitting test:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
