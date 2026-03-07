"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { claimProOffer } from "@/db/actions/billing.actions";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";

export function ClaimOfferButton({ userId }: { userId: string }) {
	const [loading, setLoading] = useState(false);
	const [claimed, setClaimed] = useState(false);

	async function handleClaim() {
		setLoading(true);
		try {
			const result = await claimProOffer(userId);
			if (result.success) {
				setClaimed(true);
				toast.success("Welcome to Pro! Your free month has started.");
				setTimeout(() => {
					window.location.href = "/dashboard";
				}, 2000);
			} else {
				toast.error(result.message || "Failed to claim offer");
			}
		} catch (error) {
			toast.error("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	if (claimed) {
		return (
			<Button disabled className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 h-12 w-full sm:w-auto">
				<CheckCircle className="w-5 h-5 mr-2" />
				Offer Claimed!
			</Button>
		);
	}

	return (
		<Button
			onClick={handleClaim}
			disabled={loading}
			className="rounded-full px-10 h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all w-full sm:w-auto"
		>
			{loading ? (
				<>
					<Loader2 className="w-5 h-5 mr-2 animate-spin" />
					Claiming...
				</>
			) : (
				"Claim My Free Pro Month 🚀"
			)}
		</Button>
	);
}
