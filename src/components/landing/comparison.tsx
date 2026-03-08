import { Check, X } from "lucide-react";

const comparisons = [
	{
		feature: "Quick Form Backend",
		formguard: true,
		formspree: true,
		typeform: false,
	},
	{
		feature: "No-code Public Form Pages",
		formguard: true,
		formspree: false,
		typeform: true,
	},
	{
		feature: "Multiple Hosted UI Themes (Notion, Word, Google Forms...)",
		formguard: true,
		formspree: "No Hosted UI",
		typeform: "Only Typeform style",
	},
	{
		feature: "Google Sheets & Notion Sync",
		formguard: true,
		formspree: "Paid plan only",
		typeform: "Paid plan only",
	},
	{
		feature: "AI Spam Protection (No Captcha needed by user)",
		formguard: true,
		formspree: false,
		typeform: false,
	},
	{
		feature: "AI Submission Insights",
		formguard: true,
		formspree: false,
		typeform: false,
	},
	{
		feature: "Generous Free Tier",
		formguard: true,
		formspree: "50/mo limit",
		typeform: "10/mo limit",
	},
];

export default function Comparison() {
	return (
		<section id="comparison" className="py-24 border-b border-border bg-background">
			<div className="mx-auto max-w-5xl px-6">
				<div className="text-center mb-16">
					<p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
						Compare
					</p>
					<h2 className="text-3xl font-semibold text-foreground mb-4">
						Why choose FormGuard?
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						See how we stack up against the alternatives. Built specifically for developers and creators who value speed and simplicity.
					</p>
				</div>

				<div className="w-full overflow-x-auto">
					<table className="w-full text-left border-collapse min-w-[600px]">
						<thead>
							<tr>
								<th className="p-4 border-b border-border font-semibold text-muted-foreground w-1/3">Features</th>
								<th className="p-4 border-b border-border font-bold text-primary text-center text-lg w-1/5 bg-primary/5 rounded-t-lg">FormGuard</th>
								<th className="p-4 border-b border-border font-semibold text-muted-foreground text-center w-1/5">Formspree</th>
								<th className="p-4 border-b border-border font-semibold text-muted-foreground text-center w-1/5">Typeform</th>
							</tr>
						</thead>
						<tbody>
							{comparisons.map((row, index) => (
								<tr key={index} className="group hover:bg-muted/30 transition-colors">
									<td className="p-4 border-b border-border/50 font-medium text-sm text-foreground">
										{row.feature}
									</td>
									<td className="p-4 border-b border-border/50 text-center bg-primary/5">
										{row.formguard === true ? (
											<Check className="w-5 h-5 mx-auto text-primary" />
										) : row.formguard === false ? (
											<X className="w-5 h-5 mx-auto text-muted-foreground/50" />
										) : (
											<span className="text-sm font-medium text-primary">{row.formguard}</span>
										)}
									</td>
									<td className="p-4 border-b border-border/50 text-center">
										{row.formspree === true ? (
											<Check className="w-5 h-5 mx-auto text-foreground/70" />
										) : row.formspree === false ? (
											<X className="w-5 h-5 mx-auto text-muted-foreground/40" />
										) : (
											<span className="text-sm text-muted-foreground">{row.formspree}</span>
										)}
									</td>
									<td className="p-4 border-b border-border/50 text-center">
										{row.typeform === true ? (
											<Check className="w-5 h-5 mx-auto text-foreground/70" />
										) : row.typeform === false ? (
											<X className="w-5 h-5 mx-auto text-muted-foreground/40" />
										) : (
											<span className="text-sm text-muted-foreground">{row.typeform}</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	);
}
