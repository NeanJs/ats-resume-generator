import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const features = [
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: "ATS optimization",
    desc: "Scores your resume against the job, then rewrites it to rank higher in applicant tracking systems.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: "Keyword analysis",
    desc: "Finds every skill and term in the job description your resume is missing, then adds them naturally.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Tailored resume",
    desc: "Rewrites your bullet points to mirror the language and priorities of the specific role you want.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    title: "Cover letter",
    desc: "Generates a matching cover letter that sounds like you, not a template — ready in seconds.",
  },
];

const steps = [
  {
    num: "01",
    title: "Upload Resume",
    desc: "Upload your existing resume.",
  },
  {
    num: "02",
    title: "Paste Job Description",
    desc: "Paste the role you're applying for.",
  },
  {
    num: "03",
    title: "Get Optimized Results",
    desc: "Receive ATS improvements, keyword suggestions, a tailored resume and cover letter.",
  },
];
const missingKeywords = [
  "TypeScript",
  "Agile",
  "Scrum",
  "Stakeholder Mgmt",
  "+6 more",
];
const addedKeywords = [
  "TypeScript",
  "Agile",
  "Scrum",
  "Stakeholder Mgmt",
  "+6 more",
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");
  return <LandingPage />;
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

function LandingPage() {
  return (
    <div
      className="min-h-screen bg-white text-gray-900"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3.5 py-1.5 text-xs text-gray-500 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          No account required &mdash; try it free right now
        </div>

        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tighter leading-[1.1] text-gray-900 max-w-2xl mx-auto mb-6">
          Your resume, rewritten{" "}
          <span className="text-gray-400">for every job you want.</span>
        </h1>

        <p className="text-lg text-gray-500 max-w-md mx-auto leading-relaxed mb-10">
          Paste a job description. ApplyCraft rewrites your resume to match it —
          fixing ATS score, adding missing keywords, and generating a cover
          letter. Takes 30 seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <Link
            href="/tailor"
            className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Tailor my resume — it&apos;s free →
          </Link>
          <a
            href="#how-it-works"
            className="text-gray-500 px-6 py-3 rounded-xl text-sm font-medium border border-gray-200 hover:border-gray-400 hover:text-gray-900 transition-colors"
          >
            See how it works
          </a>
        </div>
        <p className="text-xs text-gray-400">
          First optimization is free &mdash; no card, no signup
        </p>

        {/* Resume mockup */}
        <div className="mt-10 relative max-w-full mx-auto">
          {/* Fade-out at bottom to bleed into next section */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none rounded-b-2xl" />
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-left">
            {/* Header */}
            <div className="border-b border-gray-100 pb-5 mb-5">
              <div className="h-5 w-36 bg-gray-900 rounded-sm mb-2" />
              <div className="flex gap-4">
                <div className="h-3 w-28 bg-gray-200 rounded-full" />
                <div className="h-3 w-24 bg-gray-200 rounded-full" />
                <div className="h-3 w-32 bg-gray-200 rounded-full" />
              </div>
            </div>
            {/* Experience */}
            <div className="mb-5">
              <div className="h-3 w-20 bg-gray-300 rounded-full mb-3" />
              <div className="flex justify-between mb-1.5">
                <div className="h-3.5 w-40 bg-gray-200 rounded-full" />
                <div className="h-3 w-24 bg-gray-100 rounded-full" />
              </div>
              <div className="space-y-2 ml-1">
                <div className="h-2.5 w-full bg-gray-100 rounded-full" />
                <div className="h-2.5 w-5/6 bg-gray-100 rounded-full" />
                <div className="h-2.5 w-4/6 bg-gray-100 rounded-full" />
              </div>
            </div>
            {/* Skills */}
            <div>
              <div className="h-3 w-16 bg-gray-300 rounded-full mb-3" />
              <div className="flex flex-wrap gap-2">
                {["TypeScript", "React", "Node.js", "PostgreSQL", "AWS"].map(
                  (s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 text-xs border border-gray-200 rounded-md text-gray-400"
                    >
                      {s}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Before / After ───────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-20 -mt-8">
        {/* Before */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden mb-3">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              Before — your original resume
            </span>
            <span className="text-xs text-gray-400">
              Senior Engineer role @ Stripe
            </span>
          </div>
          <div className="p-5 grid grid-cols-2 gap-5">
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">
                ATS match score
              </p>
              <p className="text-4xl font-semibold text-red-500">54%</p>
              <ScoreBar value={54} color="#ef4444" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">
                Keywords matched
              </p>
              <p className="text-4xl font-semibold text-gray-400">6 / 18</p>
              <ScoreBar value={33} color="#d1d5db" />
            </div>
          </div>
          <div className="px-5 pb-5">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">
              Missing keywords
            </p>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((k) => (
                <span
                  key={k}
                  className="px-2.5 py-1 text-xs rounded-full bg-red-50 border border-red-200 text-red-700"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Divider label */}
        <div className="flex items-center justify-center gap-2 my-5 text-xs text-gray-400">
          <span className="inline-block w-16 h-px bg-gray-200" />
          ApplyCraft rewrites in 30 seconds
          <span className="inline-block w-16 h-px bg-gray-200" />
        </div>

        {/* After */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              After — ApplyCraft rewrite
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
              optimized
            </span>
          </div>
          <div className="p-5 grid grid-cols-2 gap-5">
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">
                ATS match score
              </p>
              <p className="text-4xl font-semibold text-emerald-600">91%</p>
              <ScoreBar value={91} color="#10b981" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">
                Keywords matched
              </p>
              <p className="text-4xl font-semibold text-gray-900">17 / 18</p>
              <ScoreBar value={94} color="#10b981" />
            </div>
          </div>
          <div className="px-5 pb-5">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">
              Keywords added
            </p>
            <div className="flex flex-wrap gap-2">
              {addedKeywords.map((k) => (
                <span
                  key={k}
                  className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Social proof bar ─────────────────────────────── */}
      <div className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-center gap-2 text-xs text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          2,400 resumes optimized this week
        </div>
      </div>

      {/* ── Features ─────────────────────────────────────── */}
      <section id="features" className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-2">
          What you get
        </p>
        <h2 className="text-3xl font-semibold tracking-tight mb-10">
          Everything a recruiter wants to see
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group border border-gray-200 rounded-xl p-6 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-default"
            >
              <div className="text-gray-400 group-hover:text-gray-700 transition-colors mb-4">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section
        id="how-it-works"
        className="border-t border-gray-100 bg-gray-50"
      >
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="mb-12">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
              Three steps. One great resume.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200 rounded-xl overflow-hidden">
            {steps.map((s) => (
              <div key={s.num} className="bg-gray-50 px-7 py-8">
                <span className="text-3xl font-semibold text-gray-200 block mb-4">
                  {s.num}
                </span>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-28 text-center">
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5 leading-[1.1]">
          Stop sending the same resume
          <br />
          <span className="text-gray-400">to every job.</span>
        </h2>
        <p className="text-gray-500 mb-10 max-w-xs mx-auto text-base leading-relaxed">
          2,400 resumes optimized this week. First one is always free.
        </p>
        <Link
          href="/tailor"
          className="inline-flex items-center bg-gray-900 text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Tailor my resume — it&apos;s free →
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gray-900 inline-block" />
            <span className="text-xs font-medium text-gray-500">
              ApplyCraft
            </span>
          </div>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} ApplyCraft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
