'use server';

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { signOut } from '@/auth';

export async function generateNewCode(prevState: any, formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string | null;

  if (!fullName) {
    return { message: 'Full name is required', error: true };
  }

  let code = '';
  let isUnique = false;
  let attempts = 0;

  // Generate unique code with retry logic
  while (!isUnique && attempts < 10) {
    code = Math.floor(100000 + Math.random() * 900000).toString();
    const existing = await prisma.testUser.findUnique({ where: { testCode: code } });
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    return { message: 'Failed to generate a unique code. Please try again.', error: true };
  }

  try {
    await prisma.testUser.create({
      data: {
        fullName,
        email,
        testCode: code,
      },
    });

    revalidatePath('/admin/dashboard');
    return { message: `Code generated: ${code}`, success: true, code };
  } catch (e) {
    console.error(e);
    return { message: 'Database error occurred.', error: true };
  }
}

export async function handleSignOut() {
  await signOut({ redirectTo: '/admin/login' });
}
