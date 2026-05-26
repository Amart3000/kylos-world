import Hero from "@/components/home/Hero";
import QuickStats from "@/components/home/QuickStats";

export const revalidate = 86400;

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickStats />
    </>
  );
}
