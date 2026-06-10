import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId } = await req.json();

    if (!resumeId) {
      return Response.json({ error: "Missing resumeId" }, { status: 400 });
    }

    const baseUrl =
      process.env.NODE_ENV == "development"
        ? "http://localhost:3000"
        : process.env.BASE_URL;
    const token = process.env.BROWSERLESS_TOKEN;

    const url = `${baseUrl}/resume/${resumeId}/print`;

    const pdfRes = await fetch(
      `https://chrome.browserless.io/pdf?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          options: {
            printBackground: true,
            format: "A4",
          },
        }),
      },
    );

    if (!pdfRes.ok) {
      const text = await pdfRes.text();
      console.error("Browserless error:", text);
      throw new Error("PDF generation failed");
    }

    const pdfBuffer = await pdfRes.arrayBuffer();

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      },
    });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
