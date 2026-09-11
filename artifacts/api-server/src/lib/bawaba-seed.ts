import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { createClerkClient } from "@clerk/backend";
import { db } from "@workspace/db";
import {
  bawabaFinishingServices,
  bawabaProfessionals,
  bawabaProducts,
  bawabaProperties,
  bawabaUsers,
} from "@workspace/db";
import {
  finishingServices,
  professionals,
  products,
  properties,
} from "./makana-data";

async function advanceSequence(tableName: string) {
  await db.execute(
    sql.raw(
      `SELECT setval(pg_get_serial_sequence('${tableName}', 'id'), COALESCE((SELECT MAX(id) FROM ${tableName}), 1))`,
    ),
  );
}

export async function ensureBawabaSeed() {
  const existingProperties = await db
    .select({ id: bawabaProperties.id })
    .from(bawabaProperties)
    .limit(1);

  if (existingProperties.length === 0) {
    await db.insert(bawabaProperties).values(
      properties.map((property) => ({
        ...property,
        amenities: property.amenities ?? [],
        isDemo: true,
      })),
    );
    await advanceSequence("bawaba_properties");
  }

  const existingServices = await db
    .select({ id: bawabaFinishingServices.id })
    .from(bawabaFinishingServices)
    .limit(1);
  if (existingServices.length === 0) {
    await db.insert(bawabaFinishingServices).values(
      finishingServices.map((service) => ({
        ...service,
        isDemo: true,
      })),
    );
    await advanceSequence("bawaba_finishing_services");
  }

  const existingProfessionals = await db
    .select({ id: bawabaProfessionals.id })
    .from(bawabaProfessionals)
    .limit(1);
  if (existingProfessionals.length === 0) {
    await db.insert(bawabaProfessionals).values(
      professionals.map((professional) => ({
        ...professional,
        rating: Math.round(professional.rating * 10),
        image: professional.image ?? null,
        bio: professional.bio ?? null,
        isDemo: true,
      })),
    );
    await advanceSequence("bawaba_professionals");
  }

  const existingProducts = await db
    .select({ id: bawabaProducts.id })
    .from(bawabaProducts)
    .limit(1);
  if (existingProducts.length === 0) {
    await db.insert(bawabaProducts).values(
      products.map((product) => ({
        ...product,
        badge: product.badge ?? null,
        description: product.description ?? null,
        isDemo: true,
      })),
    );
    await advanceSequence("bawaba_products");
  }

  const existingUsers = await db
    .select({ id: bawabaUsers.id })
    .from(bawabaUsers)
    .limit(1);
  if (existingUsers.length === 0) {
    await db.insert(bawabaUsers).values([
      {
        clerkUserId: "demo-admin",
        email: "admin@bawaba.test",
        fullName: "مدير بوابة التجريبي",
        phone: "01000000001",
        role: "admin",
        isDemo: true,
      },
      {
        clerkUserId: "demo-customer",
        email: "customer@bawaba.test",
        fullName: "عميل بوابة التجريبي",
        phone: "01000000002",
        role: "customer",
        isDemo: true,
      },
    ]);
    await advanceSequence("bawaba_users");
  }

  await ensureDemoClerkUsers();
}

async function ensureDemoClerkUsers() {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) return;

  const clerk = createClerkClient({ secretKey });
  const demoAccounts = [
    {
      email: "admin@bawaba.test",
      password: "Admin@Bawaba2026!",
      fullName: "مدير بوابة التجريبي",
      role: "admin",
      phone: "01000000001",
    },
    {
      email: "customer@bawaba.test",
      password: "Customer@Bawaba2026!",
      fullName: "عميل بوابة التجريبي",
      role: "customer",
      phone: "01000000002",
    },
  ] as const;

  for (const account of demoAccounts) {
    try {
      const result = await clerk.users.getUserList({
        emailAddress: [account.email],
        limit: 1,
      });
      const user =
        result.data[0] ??
        (await clerk.users.createUser({
          emailAddress: [account.email],
          password: account.password,
          firstName: account.fullName.split(" ")[0],
          lastName: account.fullName.split(" ").slice(1).join(" "),
          publicMetadata: { role: account.role },
        }));

      const existing = await db
        .select({ id: bawabaUsers.id })
        .from(bawabaUsers)
        .where(eq(bawabaUsers.email, account.email))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(bawabaUsers)
          .set({ clerkUserId: user.id, role: account.role, fullName: account.fullName, phone: account.phone })
          .where(eq(bawabaUsers.id, existing[0].id));
      } else {
        await db.insert(bawabaUsers).values({
          clerkUserId: user.id,
          email: account.email,
          fullName: account.fullName,
          phone: account.phone,
          role: account.role,
          isDemo: true,
        });
      }
    } catch {
      // The public application remains usable if Clerk's management API is temporarily unavailable.
    }
  }
}