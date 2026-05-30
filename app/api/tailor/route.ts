import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  const { resume, jobDescription } = await req.json();

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `
You are an expert ATS resume writer.

Resume:
${resume}

Job Description:
${jobDescription}
Do not wrap in any markdown.
Do not include explanations.

Return ONLY valid JSON.

{

  "optimizedResume": "",
  "atsScore":"",
  "missingKeywords": [],
  "coverLetter": ""
}
  
`,
      },
    ],
  });
  const text = message.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  // strip markdown code fences
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let parsed;

  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    return Response.json({
      error: "Invalid JSON from model",
      raw: text,
    });
  }

  return Response.json(parsed);
}
