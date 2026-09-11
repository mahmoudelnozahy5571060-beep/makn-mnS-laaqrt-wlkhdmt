import type { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { createClerkClient } from "@clerk/backend";
import { eq } from "drizzle-orm";
import { bawabaUsers, db, type BawabaUser } from "@workspace/db";

export type AuthenticatedRequest = Request & {
  bawabaUser?: BawabaUser;
};

async function syncUser(req: Request): Promise<BawabaUser | null> {
  const { userId } = getAuth(req);
  if (!userId) return null;

  const existing = await db
    .select()
    .from(bawabaUsers)
    .where(eq(bawabaUsers.clerkUserId, userId))
    .limit(1);
  if (existing[0]) return existing[0];

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) return null;

  const clerk = createClerkClient({ secretKey });
  const clerkUser = await clerk.users.getUser(userId);
  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    `${userId}@bawaba.local`;
  const fullName =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    clerkUser.username ||
    "مستخدم بوابة";

  const byEmail = await db
    .select()
    .from(bawabaUsers)
    .where(eq(bawabaUsers.email, email))
    .limit(1);
  if (byEmail[0]) {
    const [updated] = await db
      .update(bawabaUsers)
      .set({ clerkUserId: userId, fullName })
      .where(eq(bawabaUsers.id, byEmail[0].id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(bawabaUsers)
    .values({
      clerkUserId: userId,
      email,
      fullName,
      role: "customer",
      isDemo: false,
    })
    .returning();
  return created;
}

export async function attachCurrentUser(req: AuthenticatedRequest) {
  try {
    req.bawabaUser = (await syncUser(req)) ?? undefined;
  } catch {
    req.bawabaUser = undefined;
  }
  return req.bawabaUser;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const user = await attachCurrentUser(req);
  if (!user) {
    res.status(401).json({ error: "يجب تسجيل الدخول أولًا." });
    return;
  }
  next();
}

export async function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const user = await attachCurrentUser(req);
  if (!user) {
    res.status(401).json({ error: "يجب تسجيل الدخول أولًا." });
    return;
  }
  if (!["admin", "staff"].includes(user.role)) {
    res.status(403).json({ error: "هذه الصفحة مخصصة للإدارة." });
    return;
  }
  next();
}