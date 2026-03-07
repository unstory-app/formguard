/**
 * FormGuard Cold Email Outreach Script
 * Uses Resend API to send personalized emails to manually-curated leads.
 *
 * HOW TO USE:
 *   1. Fill in the `leads` array below with real contacts you've collected ethically
 *      (e.g. your GitHub followers, newsletter subscribers, people who opted in, etc.)
 *   2. Pick the right `persona` for each lead: "developer", "founder", "freelancer", "student"
 *   3. Run: node scripts/send-outreach.mjs
 *
 * ⚠️  DO NOT add emails you scraped from the web — that's spam and violates CAN-SPAM / GDPR.
 *     Only use contacts who have some prior relationship with you or opted into hearing from you.
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? "re_XrdEfmyv_Q6tUfWXaExAvGV8Vuvp1cb7G");

const FROM    = "FormGuard <formguard@strivio.world>";
const REPLY   = "sh20raj@gmail.com";
const SITE    = "https://formguard.strivio.world";
const FOUNDER = "founder@strivio.world";

// ─── ADD YOUR LEADS HERE ──────────────────────────────────────────────────────
// persona options: "developer" | "founder" | "freelancer" | "student"
const leads = [
  // { name: "Alex", email: "alex@example.com", persona: "developer", context: "saw your GitHub project on form handling" },
  // { name: "Priya", email: "priya@startup.io", persona: "founder", context: "building something in the feedback space" },
];
// ─────────────────────────────────────────────────────────────────────────────

function getSubjectAndBody(lead) {
  const { name, persona, context } = lead;
  const firstName = name.split(" ")[0];

  const callToAction = `
→ Try it free: ${SITE}
→ Questions? Just reply or email ${FOUNDER}
  `.trim();

  if (persona === "developer") {
    return {
      subject: `${firstName}, stop copy-pasting form handlers into every project`,
      html: `
<p>Hey ${firstName},</p>

<p>${context ? `I noticed you ${context} — that's what got me thinking you might find this useful.` : `Quick one.`}</p>

<p>I built <b><a href="${SITE}">FormGuard</a></b> because I kept solving the same problem across projects: receive form data → validate → store → notify → integrate. Every. single. time.</p>

<p>With FormGuard you get a unique endpoint URL in 30 seconds. Point your form at it and you're done. Built-in spam protection (Cloudflare Turnstile), Slack/Discord/webhook notifications, Google Sheets sync, and AI-powered submission insights.</p>

<p>There's also an <b>MCP server</b> so your AI agent (Cursor, Windsurf, etc.) can query your submissions and manage forms directly. Pretty useful if you're building AI-native workflows.</p>

<p>${callToAction}</p>

<p>Would love your feedback — blunt is fine.</p>

<p>– Shaswat<br><a href="mailto:${FOUNDER}">${FOUNDER}</a></p>
`,
    };
  }

  if (persona === "founder") {
    return {
      subject: `${firstName}, your contact form is leaking leads`,
      html: `
<p>Hey ${firstName},</p>

<p>${context ? `Came across you while ${context}.` : `Reaching out because I think this is relevant for you.`}</p>

<p>Most founders I talk to are still using a $29/mo Typeform plan for a basic contact form. Or worse — a PHP script they copy-pasted from Stack Overflow in 2019.</p>

<p>I built <b><a href="${SITE}">FormGuard</a></b> to fix that. Drop one endpoint URL into any form, and you get:</p>
<ul>
  <li>Submissions stored &amp; exportable</li>
  <li>Instant Slack/email notifications</li>
  <li>Spam protection (no CAPTCHA hell for your users)</li>
  <li>AI insights that summarize what your users are actually saying</li>
</ul>

<p>Takes 2 minutes to set up. Free plan available.</p>

<p>${callToAction}</p>

<p>Happy to do a quick call too if you want to see it in action.</p>

<p>– Shaswat<br><a href="mailto:${FOUNDER}">${FOUNDER}</a></p>
`,
    };
  }

  if (persona === "freelancer") {
    return {
      subject: `${firstName}, a faster way to deliver client contact forms`,
      html: `
<p>Hey ${firstName},</p>

<p>${context ? `I came across your work — ${context}.` : `Quick message.`}</p>

<p>If you're building client sites, you've probably built the same contact form backend a dozen times. Or you're paying for Formspree and charging it back to the client.</p>

<p><b><a href="${SITE}">FormGuard</a></b> gives every client their own form endpoint in seconds — with Slack notifications, Google Sheets export, email auto-responders, and spam protection out of the box. You hand them a working dashboard, they stop emailing you constantly.</p>

<p>It's also got a public form page builder if you need a hosted form without touching code.</p>

<p>${callToAction}</p>

<p>Worth a look. Would genuinely love to hear what you think.</p>

<p>– Shaswat<br><a href="mailto:${FOUNDER}">${FOUNDER}</a></p>
`,
    };
  }

  // default: student
  return {
    subject: `${firstName}, add a real backend to your portfolio forms in 30 seconds`,
    html: `
<p>Hey ${firstName},</p>

<p>${context ? `Saw your work — ${context}.` : ``}</p>

<p>Portfolio sites look great but the contact form usually goes nowhere, right? I built <b><a href="${SITE}">FormGuard</a></b> so you can have a real, working form backend without spinning up a server or paying for anything.</p>

<p>Just point your HTML form at your FormGuard endpoint — submissions land in a dashboard, you get notified, and you can connect it to Slack, Sheets, or Discord. Free forever for personal projects.</p>

<p>${callToAction}</p>

<p>– Shaswat<br><a href="mailto:${FOUNDER}">${FOUNDER}</a></p>
`,
  };
}

// ─── SEND ────────────────────────────────────────────────────────────────────
async function main() {
  if (leads.length === 0) {
    console.log("⚠️  No leads found in the `leads` array. Add contacts first!");
    console.log("   See the instructions at the top of this file.");
    process.exit(0);
  }

  console.log(`📬 Sending to ${leads.length} leads...\n`);
  let sent = 0;
  let failed = 0;

  for (const lead of leads) {
    const { subject, html } = getSubjectAndBody(lead);
    try {
      const { data, error } = await resend.emails.send({
        from: FROM,
        to: lead.email,
        replyTo: REPLY,
        subject,
        html,
      });
      if (error) throw error;
      console.log(`✅  ${lead.email} (${lead.persona}) — ID: ${data?.id}`);
      sent++;
    } catch (err) {
      console.error(`❌  ${lead.email} — ${err?.message ?? err}`);
      failed++;
    }
    // Small delay to respect rate limits
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\nDone. ${sent} sent, ${failed} failed.`);
}

main();
