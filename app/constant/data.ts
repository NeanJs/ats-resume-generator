import { ResponseData, ResumeData } from "../types/types";

export const SampleResumeData: ResumeData = {
  name: "Nijan Adhikari",
  title: "Senior Software Engineer",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 012-3456",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/alexjohnson",
  github: "github.com/alexjohnson",
  website: "alexjohnson.dev",
  summary:
    "Results-driven Software Engineer with 6+ years of experience building scalable web applications. Proven track record of reducing load times by 40% and shipping features that serve millions of users. Proficient in TypeScript, React, and Node.js with strong expertise in cloud infrastructure and CI/CD pipelines.",
  skills: [
    {
      category: "Languages",
      items: ["TypeScript", "JavaScript", "Python", "Go", "SQL"],
    },
    {
      category: "Frontend",
      items: ["React", "Next.js", "Tailwind CSS", "GraphQL", "Redux"],
    },
    {
      category: "Backend",
      items: ["Node.js", "Express", "PostgreSQL", "Redis", "REST APIs"],
    },
    {
      category: "DevOps & Cloud",
      items: ["AWS", "Docker", "Kubernetes", "GitHub Actions", "Terraform"],
    },
  ],
  experience: [
    {
      company: "Acme Technologies",
      title: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2022",
      endDate: "Present",
      bullets: [
        "Architected and led migration of monolithic Rails app to microservices on AWS EKS, reducing deployment time by 65% and improving uptime to 99.98%.",
        "Built a real-time dashboard using React and WebSockets serving 50,000+ daily active users, improving data visibility for the operations team.",
        "Mentored 4 junior engineers through code reviews, pair programming, and bi-weekly 1:1s, contributing to a 30% reduction in production bugs.",
        "Collaborated with product and design to ship 12 major features on schedule across 3 quarters.",
      ],
    },
    {
      company: "Brightloop Inc.",
      title: "Software Engineer",
      location: "Remote",
      startDate: "Mar 2020",
      endDate: "Dec 2021",
      bullets: [
        "Developed and maintained a GraphQL API layer consumed by 3 client applications, reducing average query time by 45% through batching and caching.",
        "Implemented automated end-to-end testing suite using Playwright, achieving 85% code coverage and cutting QA cycle time in half.",
        "Contributed to open-source tooling that accumulated 1,200+ GitHub stars within 6 months of release.",
      ],
    },
    {
      company: "DevStudio Labs",
      title: "Junior Software Engineer",
      location: "Austin, TX",
      startDate: "Jun 2018",
      endDate: "Feb 2020",
      bullets: [
        "Built reusable React component library adopted across 5 internal products, accelerating feature development by an estimated 20%.",
        "Integrated third-party payment API (Stripe) handling $2M+ in monthly transactions with 99.9% success rate.",
      ],
    },
  ],
  education: [
    {
      institution: "University of Texas at Austin",
      degree: "Bachelor of Science",
      field: "Computer Science",
      graduationDate: "May 2018",
      gpa: "3.7/4.0",
      honors: "Magna Cum Laude",
    },
  ],
  projects: [
    {
      name: "OpenTrack",
      description:
        "Open-source project management CLI tool with AI-powered task prioritization.",
      technologies: ["Go", "OpenAI API", "SQLite"],
      link: "github.com/alexjohnson/opentrack",
    },
    {
      name: "Portfol.io",
      description:
        "SaaS platform for developers to generate and host portfolios from GitHub data.",
      technologies: ["Next.js", "Supabase", "Vercel"],
      link: "portfol.io",
    },
  ],
  certifications: [
    "AWS Certified Solutions Architect – Associate (2023)",
    "Google Professional Cloud Developer (2022)",
  ],
};

export const SampleData: ResponseData = {
  jobType: "startup",

  // 🔥 NEW ATS MODEL
  atsBefore: 58,
  atsAfter: 72,
  atsImprovement: 14,

  resumeId: "res_8f3k2a9z",

  promptSignup: true,
  saved: false,

  optimizedResume: SampleResumeData,

  missingKeywords: [
    "System Design",
    "Scalability",
    "Cloud Infrastructure",
    "AWS",
    "CI/CD Pipelines",
    "Microservices Architecture",
    "Product Ownership",
    "Performance Optimization",
  ],

  // (optional but recommended if your UI uses it later)
  changesMade: [
    "Rewrote bullet points for impact",
    "Added startup-focused keywords",
    "Improved action verbs",
    "Reordered experience for relevance",
  ],

  coverLetter:
    "Dear Hiring Manager,\n\nI am writing to express my interest in the Full Stack Engineer role at your company. With over four years of experience building scalable web applications in fast-paced environments, I have developed strong expertise in both frontend and backend development, with a focus on delivering user-centric and high-performance solutions.\n\nIn my recent role as a Full Stack Developer, I worked on building and optimizing web platforms used by thousands of users. I contributed to designing RESTful APIs, improving application performance, and collaborating closely with designers and product managers to ship features quickly and efficiently.\n\nWhat excites me about this opportunity is the chance to work in a high-ownership environment where speed, impact, and innovation are prioritized. I thrive in startup settings where I can take responsibility across the stack and contribute directly to product growth.\n\nI would welcome the opportunity to bring my experience in scalable system design, modern JavaScript frameworks, and cloud-based architecture to your team.\n\nThank you for your time and consideration.\n\nSincerely,\nJohn Doe",
};
