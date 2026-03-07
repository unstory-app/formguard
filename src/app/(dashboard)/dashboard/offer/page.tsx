import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import { getUserByStackAuthId } from "@/db/actions/user.actions";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { ClaimOfferButton } from "@/components/dashboard/claim-offer-button";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Special Launch Offer",
};

export default async function OfferPage() {
	const stackUser = await stackServerApp.getUser();
	if (!stackUser) redirect("/handler/sign-in");

	const dbUser = await getUserByStackAuthId(stackUser.id);
	if (!dbUser) redirect("/handler/sign-in");

	const offerEndDate = new Date("2026-03-14T23:59:59Z");
	const isExpired = new Date() > offerEndDate;

	if (isExpired) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
				<h1 className="text-3xl font-bold mb-2 text-foreground">Offer Expired</h1>
				<p className="text-muted-foreground mb-6">Sorry, this launch promotion ended on March 14, 2026.</p>
				<Button asChild variant="outline" className="rounded-full">
					<Link href="/dashboard">Back to Dashboard</Link>
				</Button>
			</div>
		);
	}

	if (dbUser.plan !== "free") {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
				<h1 className="text-3xl font-bold mb-2 text-foreground">Already Claimed!</h1>
				<p className="text-muted-foreground mb-6">You are already on the {dbUser.plan} plan. Enjoy the features!</p>
				<Button asChild variant="outline" className="rounded-full">
					<Link href="/dashboard">Back to Dashboard</Link>
				</Button>
			</div>
		);
	}

	const proFeatures = [
		"Up to 10 forms (vs 1 on Free)",
		"5,000 submissions per month",
		"AI Insights for all submissions",
		"Advanced form analytics",
		"Priority support",
	];

	return (
		<div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
			<div className="text-center mb-12">
				<div className="inline-block mb-4">
					<Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
						Limited Time Offer
					</Badge>
				</div>
				<h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
					Get 1 Month of <span className="text-primary">Pro</span> for Free
				</h1>
				<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
					To celebrate our launch, we're giving all early adopters a full month of our Pro plan. No credit card required. Experience the full power of FormGuard.
				</p>
			</div>

			<Card className="border border-primary/20 bg-card/50 shadow-2xl shadow-primary/5 overflow-hidden rounded-3xl">
				<div className="bg-primary h-1.5 w-full" />
				<CardContent className="p-8 md:p-12">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
						<div>
							<h3 className="text-2xl font-bold mb-8 text-foreground">Pro Plan Includes:</h3>
							<ul className="space-y-5">
								{proFeatures.map((feature) => (
									<li key={feature} className="flex items-start gap-4">
										<div className="mt-0.5 bg-primary/10 rounded-full p-1 border border-primary/10">
											<Check className="w-4 h-4 text-primary" />
										</div>
										<span className="text-foreground font-medium text-sm">{feature}</span>
									</li>
								))}
							</ul>
						</div>
						<div className="flex flex-col items-center justify-center bg-accent/30 rounded-3xl p-10 border border-border/40 text-center relative overflow-hidden">
							<div className="absolute top-0 right-0 p-4">
								<Zap className="w-12 h-12 text-primary/5 rotate-12" />
							</div>
							<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">Value: $9.00 / mo</p>
							<div className="flex items-baseline gap-1 mb-1">
								<span className="text-5xl font-black text-foreground">$0</span>
								<span className="text-muted-foreground font-medium">.00</span>
							</div>
							<p className="text-xs text-muted-foreground mb-10">Free for 30 days</p>
							
							<div className="w-full">
								<ClaimOfferButton userId={dbUser.id} />
							</div>
							
							<p className="mt-8 text-[9px] text-muted-foreground font-mono uppercase tracking-tight">
								Offer valid until March 14, 2026
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
