import { JsonValue } from "@prisma/client/runtime/library";

export interface WorkExperience {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  honors?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary: string;
  skills: { category: string; items: string[] }[];
  experience: WorkExperience[];
  education: Education[];
  projects?: Project[];
  certifications?: string[];
}

export type JobType = "corporate" | "startup" | "leadership";

//
// 🔥 ATS BREAKDOWN (matches Prisma atsBreakdown Json)
//
export interface ATSBreakdown {
  keywordMatch: number; // %
  structureScore: number; // %
  readabilityScore: number; // %
  roleMatch: number; // %
}

export interface ResponseData {
  jobType: JobType;

  atsBefore: number;
  atsAfter: number;

  atsImprovement?: number;

  atsBreakdown?: ATSBreakdown | null;

  optimizedResume: ResumeData;
  missingKeywords: string[];
  coverLetter: string;

  changesMade?: string[];

  resumeId: string | null;
  saved: boolean;
  promptSignup: boolean;

  confidenceScore?: number;
}

export interface PreviewResponse {
  jobType: JobType;

  atsBefore: number;
  atsAfter: number;

  missingKeywords: string[];
  changesMade: string[];

  confidenceScore?: number;

  promptSignup: true;
}

export type TailorResponse = ResponseData | PreviewResponse;
//
// 🚨 RATE LIMIT ERROR (unchanged but cleaner)
//
export interface RateLimitError {
  error: "free_limit_reached";
  message: string;
}

export function isRateLimitError(data: unknown): data is RateLimitError {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as RateLimitError).error === "free_limit_reached"
  );
}
export function parseATSBreakdown(
  raw: JsonValue | undefined | null,
): ATSBreakdown | null {
  if (
    raw === null ||
    raw === undefined ||
    typeof raw !== "object" ||
    Array.isArray(raw)
  ) {
    return null;
  }

  const r = raw as Record<string, unknown>;

  if (
    typeof r.keywordMatch !== "number" ||
    typeof r.structure !== "number" ||
    typeof r.readability !== "number" ||
    typeof r.roleMatch !== "number"
  ) {
    return null;
  }

  return {
    keywordMatch: r.keywordMatch,
    structureScore: r.structure,
    readabilityScore: r.readability,
    roleMatch: r.roleMatch,
  };
}

export type Plan = "anonymous" | "free" | "pro";
