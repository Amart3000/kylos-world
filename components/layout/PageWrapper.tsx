import ForestMark from "@/components/ui/WolfMark";

export default function PageWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative max-w-5xl mx-auto px-4 sm:px-6 py-8 ${className}`}>
      {/* Forest mark decorations peek over the card edges */}
      <ForestMark size={80} className="absolute -top-3 -right-3 text-warm-300/70 rotate-6 pointer-events-none select-none hidden sm:block z-10" />
      <ForestMark size={60} className="absolute top-28 -left-3 text-warm-300/70 -rotate-4 pointer-events-none select-none hidden sm:block z-10" />

      {/* Frosted glass content card */}
      <div className="relative bg-warm-50/82 backdrop-blur-md rounded-3xl shadow-2xl px-6 sm:px-10 py-10 border border-white/40">
        {children}
      </div>
    </div>
  );
}
