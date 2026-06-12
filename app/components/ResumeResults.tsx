"use client";

import MissingKeywords from "@/app/components/MissingKeywords";
import CoverLetter from "@/app/components/CoverLetter";
import { handleDownload, handlePDFExport } from "@/app/services/services";
import { ATSBreakdown, ResponseData, ResumeData } from "@/app/types/types";
import { useState } from "react";
import ResumeTemplate from "../template/resume-template";
import Link from "next/link";
import toast from "react-hot-toast";

// ── Constants ─────────────────────────────────────────────────────────────

const JOB_TYPE_LABELS: Record<string, { label: string; description: string }> =
  {
    corporate: {
      label: "Corporate",
      description: "Structured, execution-focused roles",
    },
    startup: {
      label: "Startup",
      description: "Ownership-driven, high-impact environments",
    },
    leadership: {
      label: "Leadership",
      description: "Strategy, influence, and team-level impact",
    },
  };

const BREAKDOWN_META: Record<
  keyof ATSBreakdown,
  { label: string; description: string }
> = {
  keywordMatch: {
    label: "Keyword match",
    description: "Required skills and terms found in your resume",
  },
  structure: {
    label: "Structure",
    description: "Section order, formatting, and parsability",
  },
  readability: {
    label: "Readability",
    description: "Clarity and conciseness of your bullet points",
  },
  roleMatch: {
    label: "Role match",
    description: "Alignment between your experience and the role level",
  },
};

// ── ATS breakdown row ─────────────────────────────────────────────────────

function BreakdownRow({
  label,
  description,
  value,
}: {
  label: string;
  description: string;
  value: number;
}) {
  const pct = Math.round(value);
  const color =
    pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
  const textColor =
    pct >= 75
      ? "text-emerald-600"
      : pct >= 50
        ? "text-amber-500"
        : "text-red-500";

  return (
    <div className="flex items-center gap-4">
      <div className="w-32 flex-shrink-0">
        <p className="text-xs font-medium text-gray-700">{label}</p>
        <p className="text-[11px] text-gray-400 leading-tight">{description}</p>
      </div>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={`text-xs font-semibold tabular-nums w-8 text-right ${textColor}`}
      >
        {pct}%
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export default function ResumeResults({
  result,
  copied,
  resumeID,
}: {
  result: ResponseData;
  copied: boolean;
  resumeID?: string;
}) {
  const [localCopied, setLocalCopied] = useState(false);

  const handleCopy = (data: ResumeData) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setLocalCopied(true);
    toast.success("Copied to clipboard!!");
    setTimeout(() => setLocalCopied(false), 2000);
  };

  const isCopied = copied || localCopied;

  const atsBefore = result.atsBefore ?? 0;
  const atsAfter = result.atsAfter ?? 0;
  const improvement = atsAfter - atsBefore;
  const confidenceScore = result.confidenceScore ?? 0;
  const isPreview = false;
  const changesMade = result.changesMade ?? [];
  const breakdown = result.atsBreakdown;

  const jobTypeInfo = JOB_TYPE_LABELS[result.jobType] ?? {
    label: result.jobType ?? "Custom",
    description: "Tailored optimization based on job description",
  };

  return (
    <div className="mt-10 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* ── Role type + ATS scores ── */}
      <section className="px-8 py-8 border-b border-gray-100">
        {/* Job type pill */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] font-semibold uppercase text-gray-400 tracking-wider">
            Role type detected
          </span>
          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-gray-900 text-white">
            {jobTypeInfo.label}
          </span>
          <span className="text-[11px] text-gray-400">
            {jobTypeInfo.description}
          </span>
        </div>

        {/* Before / after / improvement / confidence */}
        <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-4">
          ATS improvement
        </p>
        <div className="flex items-center gap-10 mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-0.5">Before</p>
            <p className="text-2xl font-semibold text-red-500">{atsBefore}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-0.5">After</p>
            <p className="text-2xl font-semibold text-emerald-600">
              {atsAfter}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-0.5">Improvement</p>
            <p className="text-2xl font-semibold text-gray-900">
              +{improvement}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-0.5">Confidence</p>
            <p className="text-2xl font-semibold text-emerald-600">
              {Math.round(confidenceScore * 100)}%
            </p>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-emerald-500 transition-all duration-700"
            style={{ width: `${atsAfter}%` }}
          />
        </div>

        {/* ATS breakdown — only rendered when present */}
        {breakdown && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[10px] uppercase tracking-wider text-gray-400">
                Score breakdown
              </p>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="flex flex-col gap-3">
              {(Object.keys(BREAKDOWN_META) as (keyof ATSBreakdown)[]).map(
                (key) => (
                  <BreakdownRow
                    key={key}
                    label={BREAKDOWN_META[key].label}
                    description={BREAKDOWN_META[key].description}
                    value={breakdown[key]}
                  />
                ),
              )}
            </div>
          </>
        )}
      </section>

      {/* ── Optimized resume ── */}
      {!isPreview && (
        <section className="px-8 py-7 border-b bg-gray-50/40">
          <div className="flex justify-between items-start mb-5">
            <div>
              <p className="text-[10px] uppercase text-gray-400">
                Optimized output
              </p>
              <h2 className="text-sm font-semibold">Improved Resume</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Tailored for {jobTypeInfo.label.toLowerCase()} roles
              </p>
            </div>
            <div className="flex gap-2">
              <ActionButton onClick={() => handleCopy(result.optimizedResume)}>
                {isCopied ? "Copied" : "Copy Json{}"}
              </ActionButton>
              <ActionButton
                onClick={() => handleDownload(result.optimizedResume)}
              >
                Download .txt
              </ActionButton>

              <div className="relative group/export">
                <ActionButton
                  primary
                  disabled={!resumeID}
                  onClick={() =>
                    handlePDFExport(
                      resumeID as string,
                      result.optimizedResume.name,
                    )
                  }
                >
                  {!resumeID && (
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
                  )}
                  Export PDF
                </ActionButton>
                {!resumeID && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-gray-900 text-white text-[11px] rounded-lg whitespace-nowrap opacity-0 group-hover/export:opacity-100 transition-opacity pointer-events-none">
                    Sign up to export
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className="border rounded-xl bg-white overflow-hidden"
            style={{ zoom: 0.75 }}
          >
            <ResumeTemplate resumeData={result.optimizedResume} />
          </div>
        </section>
      )}

      {/* ── Missing keywords ── */}
      <section className="px-8 py-7 border-b">
        <p className="text-[10px] uppercase text-gray-400">Skill gaps</p>
        <h2 className="text-sm font-semibold mb-4">Missing Keywords</h2>
        <MissingKeywords list={result.missingKeywords} />
      </section>

      {/* ── What was improved ── */}
      {changesMade.length > 0 && (
        <section className="px-8 py-7 border-b">
          <p className="text-[10px] uppercase text-gray-400">Improvements</p>
          <h2 className="text-sm font-semibold mb-3">What was improved</h2>
          <ul className="text-xs text-gray-600 space-y-1">
            {changesMade.map((change, i) => (
              <li key={i}>• {change}</li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Cover letter ── */}
      {!isPreview && (
        <section className="px-8 py-7">
          <p className="text-[10px] uppercase text-gray-400">Generated</p>
          <h2 className="text-sm font-semibold mb-4">Cover Letter</h2>
          <CoverLetter text={result.coverLetter} />
        </section>
      )}

      {/* ── Signup gate for anonymous users ── */}
      {isPreview && (
        <section className="px-8 py-10 bg-gray-50 border-t">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-lg font-semibold">Your resume is ready</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              We improved your ATS score from{" "}
              <span className="font-medium text-red-500">{atsBefore}%</span> to{" "}
              <span className="font-medium text-emerald-600">{atsAfter}%</span>.
              Create a free account to view your optimized resume, cover letter,
              and export options.
            </p>
            <Link href="/sign-up">
              <button className="mt-5 bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all">
                Save my results →
              </button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

// ── Primitives ────────────────────────────────────────────────────────────

function ActionButton({
  onClick,
  children,
  primary = false,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150
        ${
          primary
            ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-700"
            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
        }`}
    >
      {children}
    </button>
  );
}
