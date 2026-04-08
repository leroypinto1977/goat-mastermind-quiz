import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/app/lib/prisma';

const schema = z.object({
  fullName: z.string().min(1),
  mobileNumber: z.string().min(6).max(20).regex(/^\+?[\d\s\-().]+$/),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Please provide a valid name and mobile number.' }, { status: 400 });
    }

    const { fullName, mobileNumber } = result.data;
    const normalised = mobileNumber.replace(/[\s\-().]/g, '');

    // Check if this mobile has already registered
    const existing = await prisma.testUser.findUnique({
      where: { mobileNumber: normalised },
    });

    if (existing) {
      return NextResponse.json({
        userId: existing.id,
        taken: existing.hasTakenTest,
      });
    }

    // Create a new record
    const user = await prisma.testUser.create({
      data: {
        fullName: fullName.trim(),
        mobileNumber: normalised,
      },
    });

    return NextResponse.json({ userId: user.id, taken: false });
  } catch (error) {
    console.error('Error starting test:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
