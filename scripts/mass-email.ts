import { Resend } from "resend";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

// Ensure RESEND_API_KEY is available
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
	console.error("❌ Error: RESEND_API_KEY environment variable is missing.");
	process.exit(1);
}

const resend = new Resend(resendApiKey);

// Define the template structures (matching our 5 segments)
const TEMPLATES: Record<string, (lead: any) => { subject: string; html: string }> = {
	"webflow_agency": (lead) => ({
		subject: `Quick question about form backends at ${lead.Company}`,
		html: `
			<p>Hey ${lead.FirstName},</p>
			<p>Love the recent Webflow builds by ${lead.Company}—the animations are incredibly smooth.</p>
			<p>I’m reaching out because I noticed your agency handles a lot of custom landing pages. How are you currently managing form submissions and spam for clients without native backends?</p>
			<p>I recently built FormGuard—an AI-native form backend that completely eliminates the need for CAPTCHAs (which ruin conversion rates) and handles everything serverlessly on Cloudflare's edge.</p>
			<p>It takes 30 seconds to hook into a Webflow or Framer form. Would you be open to trying it out on your next client build for free?</p>
			<br/>
			<p>Best,<br/>Shaswat</p>
		`,
	}),
	"react_studio": (lead) => ({
		subject: `Stopping form boilerplate at ${lead.Company}`,
		html: `
			<p>Hey ${lead.FirstName},</p>
			<p>Really impressed by ${lead.Company}'s stack—I see you guys are leaning heavily into modern React/Next.js.</p>
			<p>Quick question: Are your devs still writing manual API routes and setting up Resend/Zod every time a client needs a simple "Contact Us" or "Waitlist" form?</p>
			<p>I built <a href="https://formguard.unstory.app">FormGuard</a> to completely abstract that. You just point your frontend HTML form to our endpoint, and we handle the validation, spam-filtering (using AI, no CAPTCHA needed), and email routing natively on Cloudflare Workers.</p>
			<p>It saves about 2 hours of boilerplate per project. Want a free Pro account to test it on your next build?</p>
			<br/>
			<p>Best,<br/>Shaswat</p>
		`,
	}),
	"seo_agency": (lead) => ({
		subject: `Stopping spam leads for ${lead.Company}'s clients (without CAPTCHA)`,
		html: `
			<p>Hi ${lead.FirstName},</p>
			<p>I know as a growth agency, your primary metric for clients is qualified leads.</p>
			<p>However, I've noticed a lot of agencies are forced to use Google reCAPTCHA to stop spam, which data shows decreases form conversion rates by up to 30%.</p>
			<p>I built <a href="https://formguard.unstory.app">FormGuard</a> to solve exactly this. It's a form endpoint that uses serverless AI to silently identify and drop spam <em>before</em> it hits your client's CRM—with zero friction for the end-user.</p>
			<p>It integrates perfectly directly into Unbounce, Webflow, or custom HTML.</p>
			<p>Can I send over a quick 2-minute video showing how it increases conversion rates vs traditional forms?</p>
			<br/>
			<p>Best,<br/>Shaswat</p>
		`,
	}),
	"solo_founder": (lead) => ({
		subject: `Form backend for ${lead.Company} (No CAPTCHAs)`,
		html: `
			<p>Yo ${lead.FirstName},</p>
			<p>Following your build journey. Love what you're doing with ${lead.Company}.</p>
			<p>I know you spin up a lot of landing pages for validation. I just launched an edge-native form backend called <a href="https://formguard.unstory.app">FormGuard</a>. It lets you capture emails/waitlists instantly from plain HTML/React—no backend code or database required.</p>
			<p>Plus, no ugly CAPTCHAs. AI models silently drop the spam on the edge.</p>
			<br/>
			<p>Keep crushing it,<br/>Shaswat</p>
		`,
	}),
	"freelance_dev": (lead) => ({
		subject: `Stop writing form backends. Ship faster.`,
		html: `
			<p>Hey ${lead.FirstName},</p>
			<p>As a fellow dev, I know how annoying it is when a client wants a "simple" contact form on a static site, and you suddenly have to spin up a backend and configure NodeMailer/Resend just to send them an email.</p>
			<p>I built a tool to skip all that boilerplate: <a href="https://formguard.unstory.app">FormGuard</a>.</p>
			<p>You just drop our endpoint URL into your HTML form action. We handle the validation, filter the spam instantly using AI, and fire the email to the client. No backend code needed.</p>
			<br/>
			<p>Cheers,<br/>Shaswat</p>
		`,
	})
};

// Helper for waiting between emails to avoid spam filters
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
	const csvPath = path.join(process.cwd(), "scripts", "leads.csv");
	
	if (!fs.existsSync(csvPath)) {
		console.error("❌ Error: scripts/leads.csv not found.");
		console.log("Please create a CSV with headers: FirstName,Company,Email,Segment");
		process.exit(1);
	}

	const fileContent = fs.readFileSync(csvPath, "utf-8");
	const leads = parse(fileContent, {
		columns: true,
		skip_empty_lines: true,
	}) as any[];

	console.log(`Found ${leads.length} leads in CSV. Starting cold email sequence...\n`);

	let successCount = 0;
	let errorCount = 0;
	let foundResumePoint = false;
	const RESUME_EMAIL = "info@inseev.com";

	for (const lead of leads) {
		// Fast-forward until we find the last sent email
		if (!foundResumePoint) {
			if (lead.Email === RESUME_EMAIL) {
				foundResumePoint = true;
				console.log(`\n⏭️ Skipped everything up to ${RESUME_EMAIL}. Resuming from here...\n`);
			}
			continue;
		}
		const templateFn = TEMPLATES[lead.Segment];
		if (!templateFn) {
			console.log(`⚠️ Skipping ${lead.Email}: Unknown segment '${lead.Segment}'`);
			errorCount++;
			continue;
		}

		if (!lead.Email || !lead.FirstName || !lead.Company) {
			console.log(`⚠️ Skipping a row due to missing data (needs Email, FirstName, Company)`);
			errorCount++;
			continue;
		}

		const emailContent = templateFn(lead);

		console.log(`Sending to: ${lead.Email} (${lead.Company})`);

		try {
			const { data, error } = await resend.emails.send({
				from: process.env.RESEND_FROM_EMAIL || "Shaswat from FormGuard <formguard@strivio.world>",
				replyTo: process.env.RESEND_REPLY_TO_EMAIL || "sh20raj@gmail.com",
				to: [lead.Email],
				subject: emailContent.subject,
				html: emailContent.html,
			});

			if (error) {
				console.error(`❌ Failed to send to ${lead.Email}:`, error);
				errorCount++;
			} else {
				console.log(`✅ Success! Message ID: ${data?.id}`);
				successCount++;
			}
		} catch (err) {
			console.error(`❌ Exception sending to ${lead.Email}:`, err);
			errorCount++;
		}

		// Wait 2 seconds between emails to respect Resend rate limits and avoid spam filters
		await sleep(2000);
	}

	console.log("\n-----------------------------------");
	console.log("📊 Email Sequence Completed");
	console.log(`✅ Sent: ${successCount}`);
	console.log(`❌ Failed: ${errorCount}`);
	console.log("-----------------------------------");
}

main();
