"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { PlanName } from "@/lib/plans";

export async function upgradePlan(userId: string, plan: PlanName) {
	const [updated] = await db
		.update(users)
		.set({ plan })
		.where(eq(users.id, userId))
		.returning();

	return updated;
}

export async function claimProOffer(userId: string) {
	const offerEndDate = new Date("2026-03-14T23:59:59Z");
	const now = new Date();

	if (now > offerEndDate) {
		return { success: false, message: "Offer has expired" };
	}

	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	if (!user) return { success: false, message: "User not found" };
	if (user.plan !== "free") return { success: false, message: "You are already on a paid plan" };

	const expiresAt = new Date();
	expiresAt.setMonth(expiresAt.getMonth() + 1);

	const [updated] = await db
		.update(users)
		.set({
			plan: "pro",
			planExpiresAt: expiresAt,
		})
		.where(eq(users.id, userId))
		.returning();

	return { success: true, user: updated };
}

export async function checkPlanExpiry(userId: string) {
	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	if (!user) return null;

	if (user.plan !== "free" && user.planExpiresAt && new Date() > user.planExpiresAt) {
		const [updated] = await db
			.update(users)
			.set({
				plan: "free",
				planExpiresAt: null,
			})
			.where(eq(users.id, userId))
			.returning();
		return updated;
	}

	return user;
}
