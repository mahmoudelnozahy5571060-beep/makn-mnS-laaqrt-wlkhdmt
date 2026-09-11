import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { bawabaUsers, db } from "@workspace/db";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/auth/me", requireAuth, (req: AuthenticatedRequest, res): void => {
  res.json(req.bawabaUser);
});

router.patch("/profile", requireAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
  const user = req.bawabaUser;
  if (!user) {
    res.status(401).json({ error: "يجب تسجيل الدخول أولًا." });
    return;
  }

  const fullName = typeof req.body.fullName === "string" ? req.body.fullName.trim() : user.fullName;
  const phone = typeof req.body.phone === "string" ? req.body.phone.trim() : user.phone;
  if (fullName.length < 2) {
    res.status(400).json({ error: "اكتب اسمًا صحيحًا." });
    return;
  }

  const [updated] = await db
    .update(bawabaUsers)
    .set({ fullName, phone: phone || null, updatedAt: new Date() })
    .where(eq(bawabaUsers.id, user.id))
    .returning();
  res.json(updated);
});

export default router;