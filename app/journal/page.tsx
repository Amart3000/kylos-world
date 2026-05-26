import type { Metadata } from "next";
import { getAllJournalEntries } from "@/lib/journal";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import JournalList from "@/components/journal/JournalList";

export const metadata: Metadata = {
  title: "Journal",
  description: "Letters and notes from the people who love Kylo most.",
};

export default function JournalPage() {
  const entries = getAllJournalEntries();

  return (
    <PageWrapper>
      <SectionHeading
        title="Journal"
        subtitle="Letters written for Kylo, to read whenever he's ready."
      />
      <JournalList entries={entries} />
    </PageWrapper>
  );
}
