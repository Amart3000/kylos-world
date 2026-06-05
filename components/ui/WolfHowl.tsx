export default function WolfHowl({
  size = 120,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 165"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* === Tail sweeping up and behind === */}
      <path
        d="M72,120 C88,100 96,78 90,54 C86,38 94,24 98,14"
        stroke="currentColor"
        strokeWidth="11"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* === Seated body === */}
      <ellipse cx="44" cy="128" rx="34" ry="26" fill="currentColor" />

      {/* === Chest / neck mass === */}
      <path
        d="M24,112 C30,92 38,78 44,68
           L58,74 C54,86 52,104 54,120 Z"
        fill="currentColor"
      />

      {/* === Head tilted back (howling) === */}
      <circle cx="50" cy="64" r="22" fill="currentColor" />

      {/* === Snout pointing skyward === */}
      <path
        d="M40,52 C44,36 56,22 66,16 C72,12 72,22 66,28
           C60,34 54,42 50,50 Z"
        fill="currentColor"
      />

      {/* === Left ear (tall, forward) === */}
      <polygon points="34,52 22,18 44,46" fill="currentColor" />

      {/* === Right ear (behind head, shorter) === */}
      <polygon points="62,50 66,20 76,44" fill="currentColor" />

      {/* === Front left leg === */}
      <rect x="22" y="142" width="15" height="22" rx="7" fill="currentColor" />

      {/* === Front right leg === */}
      <rect x="44" y="142" width="15" height="22" rx="7" fill="currentColor" />

      {/* === Paws === */}
      <ellipse cx="30" cy="162" rx="12" ry="5" fill="currentColor" />
      <ellipse cx="52" cy="162" rx="12" ry="5" fill="currentColor" />
    </svg>
  );
}
