export default function ForestMark({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Two-tier pine tree silhouette */}
      <path
        d="M22,2 L8,24 L14,24 L2,46 L42,46 L30,24 L36,24 Z"
        fill="currentColor"
      />
      {/* Trunk */}
      <rect x="18" y="46" width="8" height="14" rx="2" fill="currentColor" />
    </svg>
  );
}
