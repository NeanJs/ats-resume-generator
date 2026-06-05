import { ResumeData } from "../types/types";

const formatResumeText = (data: ResumeData): string => {
  const sections: string[] = [];

  sections.push(`${data.name}
${data.title}
${data.email} | ${data.phone} | ${data.location}`);

  if (data.summary) {
    sections.push(`SUMMARY\n${data.summary}`);
  }

  if (data.skills?.length) {
    sections.push(
      `SKILLS\n${data.skills.map((s) => `${s.category}: ${s.items.join(", ")}`).join("\n")}`,
    );
  }

  if (data.experience?.length) {
    sections.push(
      `EXPERIENCE\n${data.experience
        .map(
          (exp) =>
            `${exp.title} @ ${exp.company}
${exp.location} | ${exp.startDate} - ${exp.endDate}
${exp.bullets.map((b) => `- ${b}`).join("\n")}`,
        )
        .join("\n\n")}`,
    );
  }

  if (data.projects?.length) {
    sections.push(
      `PROJECTS\n${data.projects
        .map(
          (p) => `${p.name}: ${p.description} (${p.technologies.join(", ")})`,
        )
        .join("\n")}`,
    );
  }

  if (data.education?.length) {
    sections.push(
      `EDUCATION\n${data.education
        .map(
          (e) =>
            `${e.degree} in ${e.field} - ${e.institution} (${e.graduationDate})`,
        )
        .join("\n")}`,
    );
  }

  if (data.certifications?.length) {
    sections.push(`CERTIFICATIONS\n${data.certifications.join("\n")}`);
  }

  return sections.join("\n\n");
};
const handleDownload = (optimizedResume: ResumeData) => {
  const text = formatResumeText(optimizedResume);
  const blob = new Blob([text], {
    type: "text/plain",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "Optimzed Resume.txt";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// NEW METHOD
const handlePDFExport = async (resumeId: string) => {
  const res = await fetch("/api/export-pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resumeId: resumeId }),
  });

  const blob = await res.blob();

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.pdf";
  a.click();

  URL.revokeObjectURL(url);
};
const handleDelete = async (resumeID: string) => {
  const res = await fetch("/api/resume/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resumeId: resumeID }),
  });

  if (res.ok) {
    window.location.reload();
  }
};

export { handleDownload, handlePDFExport, handleDelete };
