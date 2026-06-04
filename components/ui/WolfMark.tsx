export default function WolfMark({
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
      viewBox="0 0 60 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Ears */}
      <polygon points="7,33 3,4 24,27" fill="currentColor" />
      <polygon points="53,33 57,4 36,27" fill="currentColor" />
      {/* Inner ear sheen */}
      <polygon points="10,30 7,11 21,25" fill="white" opacity="0.22" />
      <polygon points="50,30 53,11 39,25" fill="white" opacity="0.22" />
      {/* Head */}
      <ellipse cx="30" cy="44" rx="24" ry="22" fill="currentColor" />
      {/* Snout / lighter muzzle area */}
      <ellipse cx="30" cy="52" rx="15" ry="11" fill="white" opacity="0.18" />
      {/* Eyes */}
      <circle cx="21" cy="40" r="5.5" fill="white" />
      <circle cx="39" cy="40" r="5.5" fill="white" />
      <circle cx="22" cy="41" r="2.8" fill="#162816" />
      <circle cx="40" cy="41" r="2.8" fill="#162816" />
      {/* Eye shine */}
      <circle cx="23.5" cy="39.5" r="1" fill="white" />
      <circle cx="41.5" cy="39.5" r="1" fill="white" />
      {/* Nose */}
      <ellipse cx="30" cy="49" rx="5" ry="3.5" fill="#162816" opacity="0.85" />
      {/* Smile */}
      <path
        d="M25.5,53.5 Q30,57 34.5,53.5"
        stroke="#162816"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}
