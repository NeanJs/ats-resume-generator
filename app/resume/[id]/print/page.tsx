import { prisma } from "@/app/lib/prisma";
import ResumeTemplate from "@/app/template/resume-template";
import { ResumeData } from "@/app/types/types";

export default async function PrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <div>No resume id found</div>;
  }

  const resume = await prisma.resume.findUnique({
    where: { id },
  });

  if (!resume) {
    return <div>Resume not found</div>;
  }

  return (
    <div id="resume-template">
      <ResumeTemplate
        resumeData={resume.optimizedResume as unknown as ResumeData}
      />
    </div>
  );
}
