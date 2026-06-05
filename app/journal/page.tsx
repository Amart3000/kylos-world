import type { Metadata } from "next";
import { getAllJournalEntries } from "@/lib/journal";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import JournalList from "@/components/journal/JournalList";
import NewEntryForm from "@/components/journal/NewEntryForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal",
  description: "Letters and notes from the people who love Kylo most.",
};

export default async function JournalPage() {
  const entries = await getAllJournalEntries();

  return (
    <PageWrapper>
      <SectionHeading
        title="Journal"
        subtitle="Letters written for Kylo, to read whenever he's ready."
      />
      <NewEntryForm />
      <JournalList entries={entries} />
    </PageWrapper>
  );
}
