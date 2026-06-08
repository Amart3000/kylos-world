import Hero from "@/components/home/Hero";
import QuickStats from "@/components/home/QuickStats";
import Treeline from "@/components/ui/Treeline";

export const revalidate = 86400;

export default function HomePage() {
  return (
    <>
      <Hero />
      <Treeline height={56} className="text-warm-200 -mt-1 block" />
      <QuickStats />
      <Treeline height={56} className="text-warm-200 block" />
    </>
  );
}
