import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

function getAdminEmails() {
  const raw = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "";
  return raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

export async function getAuthenticatedAdmin() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await db.user.findUnique({
    where: { clerkId },
    select: {
      id: true,
      clerkId: true,
      email: true,
      username: true,
    },
  });

  if (!user) return null;
  if (!isAdminEmail(user.email)) return null;

  return user;
}

