export default function PageWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-5xl mx-auto px-4 sm:px-6 py-12 ${className}`}>
      {children}
    </div>
  );
}
