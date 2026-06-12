import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { syncUser } from "@/app/lib/sync-user";
import { prisma } from "@/app/lib/prisma";

import { removeNullChars } from "@/app/lib/helper";
import { Prisma } from "@prisma/client";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    return ips[ips.length - 1];
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

async function checkAnonRateLimit(ip: string): Promise<boolean> {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const existing = await tx.anonUsage.findUnique({ where: { ip } });

    // Window expired — reset and allow
    if (existing && existing.resetAt < now) {
      await tx.anonUsage.update({
        where: { ip },
        data: {
          count: 1,
          resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
      return true;
    }

    // Create or increment atomically
    const entry = await tx.anonUsage.upsert({
      where: { ip },
      update: { count: { increment: 1 } },
      create: {
        ip,
        count: 1,
        resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return entry.count <= 1;
  });
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
    const ip = await getClientIP(req);
    const allowed = await checkAnonRateLimit(ip);

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
    system: [
      {
        cache_control: { type: "ephemeral", ttl: "1h" },
        type: "text",
        text: `You are an ATS resume optimization engine. Follow these steps exactly.

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
- Normalize all text — remove any irregular spacing between characters (e.g. "S U M M A R Y" → "Summary").
- Do not exaggerate. "Led a team" cannot become "Led a 50-person org" without evidence.
- Maximum 4 bullets per job. Prioritize the most relevant to the JD.
- Maximum 3 sentences for the summary. Be concise and punchy.
- Skill category labels must be 2-3 words maximum (e.g. "Leadership", "F&B Service", "Systems").
- Education descriptions must be one short line maximum, or omitted entirely if the degree title is self-explanatory.

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

Rules — never break these:
- Write conversationally in first person — the way a confident professional speaks 
  in an interview, not a formal application.
- Every claim must trace back to the resume. No fabrication.
- Must include at least one grounded operational detail: a specific event size, 
  cover count, shift type, or concrete scenario drawn directly from the resume.
- Avoid metaphors, corporate phrasing, and sentences that could apply to any 
  candidate in any role. If a sentence still makes sense with a different name 
  and a different resume, rewrite it.
- Avoid generic openers like "I am excited to apply" or "I am writing to express 
  my interest."
- Never open a body paragraph with a sentence that references the job posting 
  directly (e.g. "The duties in your posting map closely to..."). 
  Start with the candidate's experience instead.
- Closing paragraph must be confident and direct. Avoid tentative phrasing like 
  "I would welcome" or "I hope to". State intent plainly.
- If the job description mentions a specific requirement the candidate genuinely 
  cannot claim — a certification they lack, a service style they have no experience 
  in, or a responsibility outside their background — acknowledge it briefly and 
  honestly rather than omitting it.
- Do not flag specific tools or software as gaps if the candidate has demonstrated 
  experience with the broader skill category they fall under (e.g. Micros POS 
  falls under POS systems, Salesforce falls under CRM).

Structure:
- 1 opening hook — must reference something specific from the candidate's 
  background, not a general statement about the industry or role.
- 1–2 paragraphs mapping real experience to the specific requirements in the 
  job description.
- 1 closing paragraph stating intent and concrete value — what they bring, 
  not what they hope to achieve.

Tone matches jobType (same rules as Step 3).
Every claim must trace back to the resume. No fabrication.

---

OUTPUT RULES:
- Return only valid JSON. No markdown. No explanation. No preamble.
- Omit any key whose value would be null, empty string, or empty array.
- Top-level keys name, email, phone, title, location, summary are always required.
- Strictly No Emdashes or anything that would make the content look AI Generated.

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
}`,
      },
    ],
    messages: [
      {
        role: "user",
        content: `RESUME:\n${resume.slice(0, 6000)}\n\nJOB DESCRIPTION:\n${jobDescription.slice(0, 2500)}`,
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
      const atsBefore = Math.min(100, Math.max(0, parsed.atsBefore ?? 0));
      const atsAfter = Math.min(100, Math.max(0, parsed.atsAfter ?? 0));
      const confidenceScore = Math.min(
        1,
        Math.max(0, parsed.confidenceScore ?? 0),
      );
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
          atsBefore: atsBefore,
          atsAfter: atsAfter,
          atsBreakdown: parsed.atsBreakdown,
          optimizedResume: cleanOptimizedResume as Prisma.InputJsonValue,
          coverLetter: (cleanCoverLetter as string) ?? "",
          missingKeywords: parsed.missingKeywords ?? [],
          changesMade: parsed.changesMade ?? [],
          confidenceScore: confidenceScore,
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
    atsBreakdown: parsed.atsBreakdown,
    optimizedResume: parsed.optimizedResume,
    coverLetter: parsed.coverLetter,
    missingKeywords: parsed.missingKeywords ?? [],
    changesMade: parsed.changesMade ?? [],
    confidenceScore: parsed.confidenceScore ?? 0,
    promptSignup: true,
  });
}
