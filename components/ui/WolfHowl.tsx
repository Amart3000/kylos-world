export default function ForestScene({
  size = 120,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.65)}
      viewBox="0 0 100 165"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* === Left tall pine — 3 tiers + trunk === */}
      <polygon points="22,8 16,28 28,28" fill="currentColor" />
      <polygon points="22,20 10,48 34,48" fill="currentColor" />
      <polygon points="22,36 2,72 42,72" fill="currentColor" />
      <rect x="19" y="72" width="6" height="18" rx="2" fill="currentColor" />

      {/* === Right medium pine — 2 tiers + trunk === */}
      <polygon points="76,28 68,52 84,52" fill="currentColor" />
      <polygon points="76,40 58,78 94,78" fill="currentColor" />
      <rect x="73" y="78" width="6" height="16" rx="2" fill="currentColor" />

      {/* === Ground — left river bank === */}
      <path
        d="M0,130 C10,122 24,128 36,124 C42,122 44,126 46,132 L46,165 L0,165 Z"
        fill="currentColor"
      />

      {/* === Ground — right river bank (river flows between x=46 and x=64) === */}
      <path
        d="M64,126 C70,118 80,124 90,120 C95,118 100,122 100,120 L100,165 L64,165 Z"
        fill="currentColor"
      />

      {/* === Left boulder (rounded, on left bank) === */}
      <path
        d="M28,128 C26,120 32,116 38,118 C44,120 46,128 42,133 C38,136 30,135 28,128 Z"
        fill="currentColor"
      />

      {/* === Right boulder (smaller, on right bank) === */}
      <path
        d="M72,124 C70,118 76,114 80,116 C84,118 84,126 80,129 C76,131 74,129 72,124 Z"
        fill="currentColor"
      />

      {/* === River surface hint — two gentle wave lines === */}
      <path
        d="M47,138 C51,134 57,142 63,138"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M47,150 C52,146 58,154 63,150"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}
