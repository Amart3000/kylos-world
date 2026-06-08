import Hero from "@/components/home/Hero";
import QuickStats from "@/components/home/QuickStats";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickStats />
    </>
  );
}
