import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function syncUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  return prisma.user
    .upsert({
      where: { clerkId: userId },
      update: { email },
      create: { clerkId: userId, email },
    })
    .catch(async () => {
      return prisma.user.update({
        where: { email },
        data: { clerkId: userId },
      });
    });
}
