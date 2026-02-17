import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

import { prisma } from '@/app/lib/prisma';

// const prisma = new PrismaClient(); // Removed


const schema = z.object({
  testCode: z.string().length(6).regex(/^\d+$/),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ valid: false, error: 'Invalid code format' }, { status: 400 });
    }

    const { testCode } = result.data;

    const user = await prisma.testUser.findUnique({
      where: { testCode },
    });

    if (!user) {
      return NextResponse.json({ valid: false }, { status: 200 }); // Not found
    }

    return NextResponse.json({ 
      valid: true, 
      taken: user.hasTakenTest 
    }, { status: 200 });

  } catch (error) {
    console.error('Error validating code:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
