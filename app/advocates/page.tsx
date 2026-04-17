// app/advocates/page.tsx
// Server Component — reads all JSON files from /content/leads/advocates

import path from "path";
import fse from "fs-extra";
import AdvocatesClient from "./advocate-client";

export interface Lead {
  id: string; // filename without extension
  name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  x?: string;
  linkedin?: string;
  source?: string;
  status: string;
  notes?: string;
}

async function getLeads(): Promise<Lead[]> {
  const leadsDir = path.join(process.cwd(), "content", "leads", "advocates");

  // Ensure directory exists
  await fse.ensureDir(leadsDir);

  const files = await fse.readdir(leadsDir);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  const leads: Lead[] = await Promise.all(
    jsonFiles.map(async (file) => {
      const filePath = path.join(leadsDir, file);
      const data = await fse.readJson(filePath);
      return {
        id: file.replace(/\.json$/, ""),
        ...data,
      } as Lead;
    })
  );

  // Sort: newest-looking names first (stable alpha fallback)
  return leads.sort((a, b) => a.name.localeCompare(b.name));
}

export default async function AdvocatesPage() {
  const leads = await getLeads();
  return <AdvocatesClient leads={leads} />;
}