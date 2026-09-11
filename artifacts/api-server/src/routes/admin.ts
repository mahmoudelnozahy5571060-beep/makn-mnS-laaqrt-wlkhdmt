import { Router, type IRouter } from "express";
import { and, count, desc, eq, sum } from "drizzle-orm";
import {
  bawabaAppointments,
  bawabaFinishingServices,
  bawabaOrders,
  bawabaProducts,
  bawabaProfessionals,
  bawabaProperties,
  bawabaUsers,
  bawabaViewingRequests,
  db,
} from "@workspace/db";
import { requireAdmin, type AuthenticatedRequest } from "../middlewares/auth";

const router: IRouter = Router();
router.use(requireAdmin);

router.get("/admin/overview", async (_req, res): Promise<void> => {
  const [
    users,
    properties,
    pendingProperties,
    viewingRequests,
    appointments,
    orders,
    revenue,
  ] = await Promise.all([
    db.select({ value: count() }).from(bawabaUsers),
    db.select({ value: count() }).from(bawabaProperties),
    db.select({ value: count() }).from(bawabaProperties).where(eq(bawabaProperties.status, "Pending Review")),
    db.select({ value: count() }).from(bawabaViewingRequests),
    db.select({ value: count() }).from(bawabaAppointments),
    db.select({ value: count() }).from(bawabaOrders),
    db.select({ value: sum(bawabaOrders.total) }).from(bawabaOrders),
  ]);
  res.json({
    users: users[0]?.value ?? 0,
    properties: properties[0]?.value ?? 0,
    pendingProperties: pendingProperties[0]?.value ?? 0,
    viewingRequests: viewingRequests[0]?.value ?? 0,
    appointments: appointments[0]?.value ?? 0,
    orders: orders[0]?.value ?? 0,
    revenue: Number(revenue[0]?.value ?? 0),
  });
});

router.get("/admin/properties", async (_req, res): Promise<void> => {
  res.json(await db.select().from(bawabaProperties).orderBy(desc(bawabaProperties.createdAt)));
});

router.patch("/admin/properties/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "معرّف العقار غير صحيح." });
    return;
  }
  const changes: {
    status?: string;
    featured?: boolean;
    title?: string;
    price?: number;
    description?: string;
  } = {};
  if (typeof req.body.status === "string") changes.status = req.body.status;
  if (typeof req.body.featured === "boolean") changes.featured = req.body.featured;
  if (typeof req.body.title === "string") changes.title = req.body.title.trim();
  if (typeof req.body.price === "number") changes.price = req.body.price;
  if (typeof req.body.description === "string") changes.description = req.body.description;
  const [updated] = await db
    .update(bawabaProperties)
    .set({ ...changes, updatedAt: new Date() })
    .where(eq(bawabaProperties.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "العقار غير موجود." });
    return;
  }
  res.json(updated);
});

router.delete("/admin/properties/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const [deleted] = await db.delete(bawabaProperties).where(eq(bawabaProperties.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ error: "العقار غير موجود." });
    return;
  }
  res.json({ deleted: true, id });
});

router.get("/admin/users", async (_req, res): Promise<void> => {
  res.json(await db.select().from(bawabaUsers).orderBy(desc(bawabaUsers.createdAt)));
});

router.patch("/admin/users/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const role = ["customer", "staff", "admin"].includes(req.body.role) ? req.body.role : undefined;
  const changes = {
    ...(typeof req.body.fullName === "string" ? { fullName: req.body.fullName.trim() } : {}),
    ...(typeof req.body.phone === "string" ? { phone: req.body.phone.trim() } : {}),
    ...(role ? { role } : {}),
    updatedAt: new Date(),
  };
  const [updated] = await db.update(bawabaUsers).set(changes).where(eq(bawabaUsers.id, id)).returning();
  if (!updated) {
    res.status(404).json({ error: "المستخدم غير موجود." });
    return;
  }
  res.json(updated);
});

router.get("/admin/requests", async (_req, res): Promise<void> => {
  const [viewingRequests, appointments] = await Promise.all([
    db.select().from(bawabaViewingRequests).orderBy(desc(bawabaViewingRequests.createdAt)),
    db.select().from(bawabaAppointments).orderBy(desc(bawabaAppointments.createdAt)),
  ]);
  res.json({ viewingRequests, appointments });
});

router.get("/admin/catalog", async (_req, res): Promise<void> => {
  const [services, professionals, products] = await Promise.all([
    db.select().from(bawabaFinishingServices).orderBy(desc(bawabaFinishingServices.createdAt)),
    db.select().from(bawabaProfessionals).orderBy(desc(bawabaProfessionals.createdAt)),
    db.select().from(bawabaProducts).orderBy(desc(bawabaProducts.createdAt)),
  ]);
  res.json({ services, professionals, products });
});

router.delete("/admin/demo-data/:resource/:id", async (req: AuthenticatedRequest, res): Promise<void> => {
  const id = Number(req.params.id);
  const resource = req.params.resource;
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "المعرّف غير صحيح." });
    return;
  }

  const tables = {
    properties: bawabaProperties,
    services: bawabaFinishingServices,
    professionals: bawabaProfessionals,
    products: bawabaProducts,
  } as const;
  const table = tables[resource as keyof typeof tables];
  if (!table) {
    res.status(400).json({ error: "نوع البيانات غير مسموح." });
    return;
  }
  const [deleted] = await db
    .delete(table)
    .where(and(eq(table.id, id), eq(table.isDemo, true)))
    .returning({ id: table.id });
  if (!deleted) {
    res.status(404).json({ error: "البيانات التجريبية غير موجودة أو لا يمكن حذفها." });
    return;
  }
  res.json({ deleted: true, id });
});

export default router;