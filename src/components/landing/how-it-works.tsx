const steps = [
	{
		number: "01",
		title: "Create a Form",
		description: 'Click "Create Form" in your dashboard. Name it, set it up, done.',
	},
	{
		number: "02",
		title: "Connect or Host",
		description:
			"Get a unique endpoint URL for your HTML form, or instantly use our beautifully themed hosted pages.",
	},
	{
		number: "03",
		title: "Receive Clean Insights",
		description:
			'Submissions appear live. Click "Generate Insight" for an AI summary of everything.',
	},
];

export default function HowItWorks() {
	return (
		<section id="how-it-works" className="py-24 border-b border-border bg-background">
			<div className="mx-auto max-w-6xl px-6">
				<p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
					How It Works
				</p>
				<h2 className="text-3xl font-semibold text-foreground mb-4">
					Up and running in minutes.
				</h2>
				<p className="text-muted-foreground font-mono text-sm mb-14">
					No code required. Complete flexibility.
				</p>

				<div className="grid md:grid-cols-3 gap-8">
					{steps.map((step) => (
						<div
							key={step.number}
							className="border border-border p-8 bg-card text-card-foreground hover:border-foreground/40 transition-colors"
						>
							<p className="text-4xl font-black text-muted/60 font-mono mb-4">
								{step.number}
							</p>
							<h3 className="text-lg font-bold text-card-foreground mb-3">{step.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								{step.description}
							</p>
						</div>
					))}
				</div>

				{/* Code snippet */}
				<div className="mt-12 border border-border bg-secondary p-6 font-mono text-sm">
					<p className="text-muted-foreground mb-2 text-xs">Your integration — one line:</p>
					<pre className="text-green-500 dark:text-green-400 overflow-x-auto">{`<form action="https://formguard.unstory.app/api/submit/abc123" method="POST">`}</pre>
				</div>
			</div>
		</section>
	);
}
