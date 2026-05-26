export default function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10">
      <h1 className="font-heading text-4xl text-warm-900">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-warm-500 text-lg">{subtitle}</p>
      )}
    </div>
  );
}
