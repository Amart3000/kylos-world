import type { Metadata } from "next";
import { getAllEvents } from "@/lib/events";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import TimelineList from "@/components/timeline/TimelineList";

export const metadata: Metadata = {
  title: "Timeline",
  description: "A chronological record of Kylo's milestones.",
};

export default function TimelinePage() {
  const events = getAllEvents();

  return (
    <PageWrapper>
      <SectionHeading
        title="Timeline"
        subtitle="Every big moment, big and small, in the order they happened."
      />
      <TimelineList events={events} />
    </PageWrapper>
  );
}
