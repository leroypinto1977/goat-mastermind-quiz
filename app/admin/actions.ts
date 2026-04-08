'use server';

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { signOut } from '@/auth';

export async function createAndOpenCohort(prevState: any, formData: FormData) {
  const name = (formData.get('name') as string)?.trim();

  if (!name) {
    return { error: true, message: 'Cohort name is required.' };
  }

  try {
    // Close any currently open cohort first
    await prisma.cohort.updateMany({
      where: { isOpen: true },
      data: { isOpen: false, closedAt: new Date() },
    });

    await prisma.cohort.create({
      data: { name, isOpen: true, openedAt: new Date() },
    });

    revalidatePath('/admin/dashboard');
    return { success: true, message: `Cohort "${name}" is now open.` };
  } catch (e) {
    console.error(e);
    return { error: true, message: 'Failed to create cohort.' };
  }
}

export async function closeCohort(cohortId: string) {
  try {
    await prisma.cohort.update({
      where: { id: cohortId },
      data: { isOpen: false, closedAt: new Date() },
    });
    revalidatePath('/admin/dashboard');
  } catch (e) {
    console.error(e);
  }
}

export async function handleSignOut() {
  await signOut({ redirectTo: '/admin/login' });
}
