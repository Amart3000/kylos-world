import ForestMark from "@/components/ui/WolfMark";

export default function PageWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative max-w-5xl mx-auto px-4 sm:px-6 py-12 ${className}`}>
      {/* Subtle corner tree marks on inner pages */}
      <ForestMark size={80} className="absolute -top-2 -right-4 text-warm-100 rotate-6 pointer-events-none select-none hidden sm:block" />
      <ForestMark size={60} className="absolute top-32 -left-2 text-warm-100 -rotate-4 pointer-events-none select-none hidden sm:block" />
      {children}
    </div>
  );
}
