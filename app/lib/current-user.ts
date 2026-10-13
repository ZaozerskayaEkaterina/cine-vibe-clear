import { prisma } from "./prisma";
import { readSession } from "./auth";

export async function getCurrentUser() {
  const session = await readSession();
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true },
  });
}