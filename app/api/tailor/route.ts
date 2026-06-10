import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { syncUser } from "@/app/lib/sync-user";
import { prisma } from "@/app/lib/prisma";

import { removeNullChars } from "@/app/lib/helper";
import { Prisma } from "@prisma/client";
import { ATSBreakdown } from "@/app/types/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// ── Rate limiting for anonymous users ─────────────────────────────────────
//
// Simple in-memory store keyed by IP. Resets on server restart.
// For production, swap this out for Redis (Upstash is a good fit with Vercel).

function getClientIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
async function checkAnonRateLimit(ip: string): Promise<boolean> {
  const now = new Date();

  const entry = await prisma.anonUsage.upsert({
    where: { ip },
    update: {
      count: { increment: 1 },
    },
    create: {
      ip,
      count: 1,
      resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  // If the window has expired, reset and allow
  if (entry.resetAt < now) {
    await prisma.anonUsage.update({
      where: { ip },
      data: { count: 1, resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    });
    return true;
  }

  return entry.count <= 1;
}

// ── Route ─────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const { resume, jobDescription } = await req.json();

  if (!resume?.trim() || !jobDescription?.trim()) {
    return Response.json(
      { error: "Resume and job description are required." },
      { status: 400 },
    );
  }

  // Check auth — but don't block on it
  const { userId } = await auth();
  const isAuthed = !!userId;

  // Anonymous users: enforce rate limit
  if (!isAuthed) {
    const ip = getClientIP(req);
    const allowed = checkAnonRateLimit(ip);

    if (!allowed) {
      return Response.json(
        {
          error: "free_limit_reached",
          message: "You've used your free optimization. Sign up to keep going.",
        },
        { status: 429 },
      );
    }
  }

  // ── Call the model ───────────────────────────────────────────────────────

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: `You are an ATS resume optimization engine. Follow these steps exactly.

---

STEP 1 — CLASSIFY THE ROLE
Read the job description and assign exactly one jobType:
- "corporate"    → structured execution, process-driven, metrics-oriented
- "startup"      → ownership, speed, generalist scope, direct impact
- "leadership"   → strategy, team-building, organizational influence

This classification controls tone in every subsequent step.

---

STEP 2 — SCORE THE ORIGINAL RESUME
Count how many unique required skills, tools, and responsibilities from the job description 
appear in the original resume. atsScore = round((matches / total_jd_terms) * 100).
This score reflects the ORIGINAL resume, not the optimized version.

---

STEP 3 — OPTIMIZE THE RESUME
Hard rules — never break these:
- Do not invent companies, titles, dates, or metrics not in the original.
- Do not add skills the candidate has not demonstrated.
- Do not exaggerate. "Led a team" cannot become "Led a 50-person org" without evidence.

What you may do:
- Reframe bullets to surface relevant impact (e.g. "built internal tool" → "reduced deploy time by automating X")
- Reorder bullet points so the most relevant experience appears first.
- Swap generic verbs for stronger ones where meaning is preserved.
- Add keywords from the JD only where the underlying experience genuinely supports them.

Tone by jobType:
- corporate   → precise, formal, metric-driven
- startup     → direct, ownership-focused, outcome-first  
- leadership  → strategic, influence-oriented, org-level thinking

---

STEP 4 — IDENTIFY MISSING KEYWORDS
List keywords from the job description that could NOT be added to the resume
because the candidate has no supporting experience. These are genuine gaps.
Do not list keywords you successfully incorporated in Step 3.

---

STEP 5 — WRITE THE COVER LETTER
- Must be highly specific to the job description.
- Must reference real experience ONLY from the resume.
- Avoid generic phrases like "I am excited to apply" unless contextually justified.
- Must include:
  - 1 opening hook tied to role/company type
  - 1–2 paragraphs mapping experience to role requirements
  - 1 closing paragraph with intent and value

Tone matches jobType (same rules as Step 3).
Every claim must trace back to the resume. No fabrication.

---

OUTPUT RULES:
- Return only valid JSON. No markdown. No explanation. No preamble.
- Omit any key whose value would be null, empty string, or empty array.
- Top-level keys name, email, phone, title, location, summary are always required.

{
  "jobType": "corporate" | "startup" | "leadership",
  "atsBefore": 0,
  "atsAfter": 0,

  "atsBreakdown": {
    "keywordMatch": 0,
    "structure": 0,
    "readability": 0,
    "roleMatch": 0
  },
  "missingKeywords": [],
  "changesMade": [],
  "confidenceScore": 0.0,
  "missingKeywords": string[],
  "coverLetter": string,
  "optimizedResume": {
    "name": string,
    "title": string,
    "email": string,
    "phone": string,
    "location": string,
    "linkedin"?: string,
    "github"?: string,
    "website"?: string,
    "summary": string,
    "skills": { "category": string, "items": string[] }[],
    "experience": {
      "company": string,
      "title": string,
      "location": string,
      "startDate": string,
      "endDate": string,
      "bullets": string[]
    }[],
    "education": {
      "institution": string,
      "degree": string,
      "field": string,
      "graduationDate": string,
      "gpa"?: string,
      "honors"?: string
    }[],
    "projects"?: {
      "name": string,
      "description": string,
      "technologies": string[],
      "link"?: string
    }[],
    "certifications"?: string[]
  }
}

---

RESUME:
${resume.slice(0, 4000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 2500)}`,
      },
    ],
  });

  // ── Parse response ───────────────────────────────────────────────────────

  const text = message.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let parsed;

  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    return Response.json(
      { error: "Invalid JSON from model: " + err },
      { status: 500 },
    );
  }

  // ── Persist for authenticated users only ─────────────────────────────────

  if (isAuthed) {
    const user = await syncUser();

    if (user) {
      const cleanResume = removeNullChars(resume);
      const cleanJobDescription = removeNullChars(jobDescription);
      const cleanOptimizedResume = removeNullChars(parsed.optimizedResume);
      const cleanCoverLetter = removeNullChars(parsed.coverLetter);
      const savedResume = await prisma.resume.create({
        data: {
          userId: user.id,
          title:
            parsed.optimizedResume?.title ||
            parsed.optimizedResume?.name ||
            "Untitled Resume",
          jobType: parsed.jobType,
          originalResume: cleanResume as Prisma.InputJsonValue,
          jobDescription: cleanJobDescription as string,
          atsBefore: parsed.atsBefore,
          atsAfter: parsed.atsAfter,
          atsBreakdown: parsed.atsBreakdown,
          optimizedResume: cleanOptimizedResume as Prisma.InputJsonValue,
          coverLetter: (cleanCoverLetter as string) ?? "",
          missingKeywords: parsed.missingKeywords ?? [],
          changesMade: parsed.changesMade ?? [],
          confidenceScore: parsed.confidenceScore ?? 0,
        },
      });

      return Response.json({
        ...parsed,
        resumeId: savedResume.id,
        saved: true,
      });
    }
  }

  // Unauthenticated — return results without saving, signal the free limit
  return Response.json({
    saved: false,
    title:
      parsed.optimizedResume?.title ||
      parsed.optimizedResume?.name ||
      "Untitled Resume",
    jobType: parsed.jobType,
    atsBefore: parsed.atsBefore,
    atsAfter: parsed.atsAfter,
    missingKeywords: parsed.missingKeywords ?? [],
    changesMade: parsed.changesMade ?? [],
    confidenceScore: parsed.confidenceScore ?? 0,
    promptSignup: true,
  });
}
