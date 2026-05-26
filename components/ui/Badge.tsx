export default function Badge({ label }: { label: string }) {
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-light text-warm-800">
      {label}
    </span>
  );
}
