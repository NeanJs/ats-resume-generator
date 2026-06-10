import Link from "next/link";

import { prisma } from "@/app/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import ResumeList from "@/app/components/ResumeLists";

async function getResumes(userId: string) {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, updatedAt: true },
  });
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
export async function getDbUser(clerkId: string) {
  return prisma.user.findUnique({
    where: { clerkId },
  });
}
export default async function DashboardPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  const dbUser = await getDbUser(clerkUser.id);

  const resumes = dbUser ? await getResumes(dbUser.id) : [];

  const firstName = clerkUser?.firstName ?? "there";

  return (
    <DashboardUI
      resumes={resumes}
      firstName={firstName}
      email={dbUser?.email ?? ""}
    />
  );
}

function DashboardUI({
  resumes,
  firstName,
}: {
  resumes: {
    id: string;
    title: string;
    updatedAt: Date;
  }[];
  firstName: string;
  email: string;
}) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
              Dashboard
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Good to see you, {firstName}.
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              {resumes.length === 0
                ? "You haven't created any resumes yet."
                : `You have ${resumes.length} resume${resumes.length > 1 ? "s" : ""}.`}
            </p>
          </div>

          <Link
            href={"/tailor"}
            className="bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap cursor-pointer"
          >
            + Create Resume
          </Link>
        </div>

        {/* Resume list */}
        {resumes.length > 0 ? (
          <ResumeList resumes={resumes} />
        ) : (
          /* Empty state */
          <div className="border border-dashed border-gray-200 rounded-2xl py-20 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-300 mb-5">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect
                  x="4"
                  y="2"
                  width="14"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <line
                  x1="8"
                  y1="7"
                  x2="14"
                  y2="7"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <line
                  x1="8"
                  y1="10.5"
                  x2="14"
                  y2="10.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <line
                  x1="8"
                  y1="14"
                  x2="11"
                  y2="14"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              No resumes yet
            </p>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
              Create your first resume and start applying to jobs today.
            </p>

            <Link
              href="/tailor"
              className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Create your first resume →
            </Link>
          </div>
        )}

        {resumes.length > 0 && (
          <p className="text-xs text-gray-300 text-center mt-10">
            {resumes.length} resume{resumes.length > 1 ? "s" : ""} · Last
            updated {formatDate(resumes[0].updatedAt)}
          </p>
        )}
      </main>
    </div>
  );
}
