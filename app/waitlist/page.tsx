"use client";
import { useState } from "react";

export default function UpgradePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) return;
    setLoading(true);

    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-2">
            Coming soon
          </p>
          <h1 className="text-4xl font-semibold tracking-tight mb-3">
            Pro is on its way.
          </h1>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Join the waitlist and we'll notify you the moment it launches —
            waitlist members get the first month free.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {/* Free */}
          <div className="border border-gray-200 rounded-2xl p-7">
            <p className="text-sm font-medium text-gray-400 mb-1">Free</p>
            <p className="text-4xl font-semibold mb-6">$0</p>
            <ul className="space-y-2.5">
              {[
                "1 optimization / month",
                "ATS before score",
                "Missing keywords",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <CheckIcon /> {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="border border-gray-900 rounded-2xl p-7 bg-gray-900 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 text-[11px] px-2.5 py-1 rounded-full bg-white/10 text-gray-300 border border-white/10">
              Coming soon
            </div>
            <p className="text-sm font-medium text-gray-400 mb-1">Pro</p>
            <div className="flex items-end gap-1.5 mb-6">
              <p className="text-4xl font-semibold">$9</p>
              <p className="text-gray-400 text-sm mb-1">/month</p>
            </div>
            <ul className="space-y-2.5">
              {[
                "Unlimited optimizations",
                "ATS before + after score",
                "Full score breakdown",
                "What was improved",
                "Optimized resume",
                "Cover letter",
                "PDF export",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-gray-300"
                >
                  <CheckIcon color="text-emerald-400" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Waitlist form */}
        {!submitted ? (
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors"
              />
              <button
                onClick={handleSubmit}
                disabled={loading || !email.trim()}
                className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition disabled:opacity-40"
              >
                {loading ? "Joining…" : "Join waitlist →"}
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">
              No spam. Just a single email when Pro launches.
            </p>
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center py-4">
            <p className="text-sm font-medium text-gray-900">
              You're on the list.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              We'll email you when Pro launches — first month is on us.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckIcon({ color = "text-emerald-500" }: { color?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className={`flex-shrink-0 ${color}`}
    >
      <path
        d="M2.5 8.5l3.5 3.5 7-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
