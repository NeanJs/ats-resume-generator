"use client";

import { useState } from "react";
import { ResponseData } from "@/app/types/types";
import ResumeResults from "@/app/components/ResumeResults";
import Link from "next/link";

type StepStatus = "done" | "active" | "pending";

function Step({
  n,
  label,
  status,
}: {
  n: string;
  label: string;
  status: StepStatus;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0 border transition-colors
          ${
            status === "done"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : status === "active"
                ? "bg-gray-900 border-gray-900 text-white"
                : "bg-gray-50 border-gray-200 text-gray-400"
          }`}
      >
        {status === "done" ? (
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
            <path
              d="M1.5 5l2.5 2.5 4.5-4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          n
        )}
      </div>
      <span
        className={`text-xs ${status === "active" ? "text-gray-900 font-medium" : "text-gray-400"}`}
      >
        {label}
      </span>
    </div>
  );
}

function StepDivider() {
  return <div className="w-px h-4 bg-gray-200 mx-1" />;
}

// ── Loading progress ──────────────────────────────────────────────────────

const LOADING_STEPS = [
  { label: "Classifying role type" },
  { label: "Scoring original resume" },
  { label: "Rewriting resume bullets" },
  { label: "Generating cover letter" },
];

function LoadingProgress({ step }: { step: number }) {
  return (
    <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-900">
          Generating your results
        </p>
        <p className="text-xs text-gray-400">~30 seconds</p>
      </div>
      <div className="flex flex-col gap-3">
        {LOADING_STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={s.label} className="flex items-center gap-3 text-sm">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border
                  ${
                    done
                      ? "bg-emerald-50 border-emerald-200"
                      : active
                        ? "bg-white border-gray-300"
                        : "bg-gray-100 border-gray-200"
                  }`}
              >
                {done ? (
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M1.5 5l2.5 2.5 4.5-4.5"
                      stroke="#3b6d11"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : active ? (
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                ) : null}
              </div>
              <span
                className={done || active ? "text-gray-700" : "text-gray-300"}
              >
                {s.label}
              </span>
              {done && i === 0 && (
                <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                  detected
                </span>
              )}
              {done && i === 1 && (
                <span className="ml-auto text-xs text-gray-400">scored</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tip pill ──────────────────────────────────────────────────────────────

function Tip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
      {icon}
      {label}
    </div>
  );
}

// ── Input panel ───────────────────────────────────────────────────────────

function InputPanel({
  title,
  icon,
  placeholder,
  value,
  onChange,
  maxLength,
  badge,
  footer,
}: {
  title: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {icon}
          {title}
        </div>
        {badge}
      </div>
      <textarea
        className="flex-1 min-h-[200px] px-4 py-3 text-sm text-gray-900 bg-white placeholder-gray-300 resize-none focus:outline-none leading-relaxed"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
      />
      {footer && (
        <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
          {footer}
          <span className="text-[11px] text-gray-300">
            {value.length.toLocaleString()} / {maxLength.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function TailorPage() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ResponseData>();
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const hasResume = resume.trim().length > 0;
  const hasJD = jobDescription.trim().length > 0;
  const canGenerate = !loading && hasResume && hasJD;

  // Simulate step progression during loading so the UI isn't static
  async function generate() {
    setLoading(true);
    setLoadingStep(0);
    setResult(undefined);

    const interval = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 7000);

    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });
      const data = await res.json();
      setResult(data);
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingStep(0);
    }
  }

  // Derive step indicator state
  const step1: StepStatus = hasResume ? "done" : "active";
  const step2: StepStatus =
    hasResume && hasJD ? "done" : hasResume ? "active" : "pending";
  const step3: StepStatus = result ? "done" : loading ? "active" : "pending";

  return (
    <div
      className="min-h-screen bg-white text-gray-900"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Navbar slot */}

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-2">
            Resume optimizer
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">
            Tailor your resume to any job.
          </h1>
          <p className="text-sm text-gray-500 max-w-lg leading-relaxed mb-5">
            Paste your resume and the job description — get an ATS score,
            missing keywords, an optimized resume, and a cover letter.
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-1 flex-wrap">
            <Step n="1" label="Paste resume" status={step1} />
            <StepDivider />
            <Step n="2" label="Add job description" status={step2} />
            <StepDivider />
            <Step n="3" label="Get results" status={step3} />
          </div>
        </div>

        {/* Input grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <InputPanel
            title="Your resume"
            icon={
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M9 1H3a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V6L9 1z"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 1v5h5M5 9h6M5 11.5h4"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
            }
            placeholder="Paste your current resume here…"
            value={resume}
            onChange={setResume}
            maxLength={4000}
            badge={
              hasResume ? (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                  ready
                </span>
              ) : (
                <span className="text-[11px] text-gray-300">
                  {resume.length} / 4000
                </span>
              )
            }
            // footer={
            //   <span className="text-[11px] text-gray-400 flex items-center gap-1">
            //     <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            //       <path
            //         d="M8 2v8m0 0l-3-3m3 3l3-3M2 13h12"
            //         stroke="currentColor"
            //         strokeWidth="1.5"
            //         strokeLinecap="round"
            //         strokeLinejoin="round"
            //       />
            //     </svg>
            //     Upload PDF instead
            //   </span>
            // }
          />
          <InputPanel
            title="Job description"
            icon={
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect
                  x="1"
                  y="3"
                  width="14"
                  height="11"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
                <path
                  d="M5 7h6M5 10h4"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
            }
            placeholder={
              "Paste the full job description here…\n\nTip: include the complete posting for the best keyword match."
            }
            value={jobDescription}
            onChange={setJobDescription}
            maxLength={2500}
            badge={
              hasJD ? (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                  ready
                </span>
              ) : (
                <span className="text-[11px] text-gray-300">0 / 2500</span>
              )
            }
            // footer={
            //   <span className="text-[11px] text-gray-400 flex items-center gap-1">
            //     <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
            //       <path
            //         d="M6.5 3.5h-3a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1v-3"
            //         stroke="currentColor"
            //         strokeWidth="1.25"
            //         strokeLinecap="round"
            //       />
            //       <path
            //         d="M9 1h5.5v5.5M14.5 1L8 7.5"
            //         stroke="currentColor"
            //         strokeWidth="1.25"
            //         strokeLinecap="round"
            //         strokeLinejoin="round"
            //       />
            //     </svg>
            //     Paste a URL instead
            //   </span>
            // }
          />
        </div>

        {/* CTA */}
        <button
          onClick={generate}
          disabled={!canGenerate}
          className={`w-full py-3.5 rounded-xl text-sm font-medium transition-all mb-4 ${
            canGenerate
              ? "bg-gray-900 text-white hover:bg-gray-700 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating…
            </span>
          ) : (
            "Optimize resume →"
          )}
        </button>

        {/* Trust tips */}
        {!loading && !result && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Tip
              icon={
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <circle
                    cx="8"
                    cy="8"
                    r="6.5"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  />
                  <path
                    d="M8 5v3.5l2 2"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                </svg>
              }
              label="~30 seconds"
            />
            <Tip
              icon={
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="3"
                    y="7"
                    width="10"
                    height="7"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  />
                  <path
                    d="M5.5 7V5a2.5 2.5 0 015 0v2"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                </svg>
              }
              label="Your data isn't stored"
            />
            <Tip
              icon={
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1.5l1.5 3.5H13l-2.8 2.2 1 3.5L8 8.7l-3.2 2 1-3.5L3 5h3.5L8 1.5z"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              label="First one is free"
            />
          </div>
        )}

        {/* Loading progress */}
        {loading && <LoadingProgress step={loadingStep} />}

        {/* Results */}
        {result && (
          <ResumeResults resumeID={resume} result={result} copied={false} />
        )}

        {/* Post-result footer */}
        {result && !loading && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Optimize again by editing above
            </p>
            <Link
              href="/dashboard"
              className="text-xs font-medium text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
              ← Back to dashboard
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
