import type { Metadata } from "next";
import { LeadsTable } from "@/components/LeadsTable";

export const metadata: Metadata = {
  title: "Leads — Panel interno Tarífalo",
  robots: { index: false, follow: false },
};

export default function AdminLeadsPage() {
  return <LeadsTable />;
}
