import WolfMark from "@/components/ui/WolfMark";

export default function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3">
        <WolfMark size={36} className="text-accent shrink-0" />
        <h1 className="font-heading text-4xl text-warm-900">{title}</h1>
      </div>
      {subtitle && (
        <p className="mt-2 text-warm-500 text-lg">{subtitle}</p>
      )}
    </div>
  );
}
