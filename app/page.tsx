"use client";

import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);

    const res = await fetch("/api/tailor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume,
        jobDescription,
      }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">ATS Resume Tailor</h1>

      <textarea
        className="border w-full h-48 p-3 mb-4"
        placeholder="Paste Resume"
        value={resume}
        onChange={(e) => setResume(e.target.value)}
      />

      <textarea
        className="border w-full h-48 p-3 mb-4"
        placeholder="Paste Job Description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button onClick={generate} className="px-6 py-3 border rounded">
        {loading ? "Generating..." : "Generate"}
      </button>

      {result && (
        <div className="mt-8 space-y-8">
          <h1 className="text-5xl font-bold">{result.atsScore}%</h1>
          <div>
            <h2 className="text-2xl font-bold">Optimized Resume</h2>

            <pre className="whitespace-pre-wrap">{result.optimizedResume}</pre>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Missing Keywords</h2>

            <ul>
              {result.missingKeywords.map((keyword: string, i: number) => (
                <li key={i}>• {keyword}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Cover Letter</h2>

            <pre className="whitespace-pre-wrap">{result.coverLetter}</pre>
          </div>
        </div>
      )}
    </main>
  );
}
