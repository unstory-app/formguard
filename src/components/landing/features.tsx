const features = [
	{ icon: "⚡", title: "Plug & Play Backend", benefit: "Point your form action to our URL. Start receiving submissions instantly. No code needed." },
	{ icon: "🎨", title: "Themeable Public Pages", benefit: "Get auto-generated public pages with beautiful themes out of the box: MS Word, Notion-like, Google Form, Minimal, or Typeform style. New community themes launched weekly." },
	{ icon: "🛡️", title: "Smart Spam Protection", benefit: "AI-powered bot detection without annoying users with completely invisible captchas." },
	{ icon: "🔗", title: "Powerful Integrations", benefit: "Sync submissions straight to Google Sheets, Notion, Telegram, or Discord." },
	{ icon: "🌟", title: "AI Insight Engine", benefit: "Automatically analyze responses to understand what your users actually want." },
	{ icon: "👥", title: "Team Workspaces", benefit: "Collaborate on forms, manage submissions, and review insights with your entire team." },
];

export default function Features() {
	return (
		<section id="features" className="py-24 border-b border-border bg-background">
			<div className="mx-auto max-w-6xl px-6">
				<p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
					Infrastructure
				</p>
				<h2 className="text-3xl font-semibold text-foreground mb-14">
					Built for scale.
					<br />
					<span className="text-muted-foreground">Minimal by design.</span>
				</h2>

				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
					{features.map((feature) => (
						<div
							key={feature.title}
							className="bg-card text-card-foreground p-8 hover:bg-accent transition-colors"
						>
							<p className="text-2xl mb-4">{feature.icon}</p>
							<h3 className="text-base font-bold text-card-foreground mb-2">{feature.title}</h3>
							<p className="text-sm text-muted-foreground">{feature.benefit}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
