import Hero from "@/components/home/Hero";
import QuickStats from "@/components/home/QuickStats";
import ForestBackground from "@/components/home/ForestBackground";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <ForestBackground />
      <div className="relative z-10">
        <Hero />
        <QuickStats />
      </div>
    </div>
  );
}
