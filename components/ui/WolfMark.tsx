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
      viewBox="0 0 100 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* === Ears — tall, sharply pointed === */}
      <polygon points="20,42 6,2 40,34" fill="currentColor" />
      <polygon points="80,42 94,2 60,34" fill="currentColor" />
      {/* Inner ear — lighter fur */}
      <polygon points="24,39 12,8 37,31" fill="white" opacity="0.20" />
      <polygon points="76,39 88,8 63,31" fill="white" opacity="0.20" />

      {/* === Head — angular wolf shape, wider at cheeks === */}
      <path
        d="M50,26 C68,26 90,40 92,62 C94,80 82,100 66,110
           C59,114 50,117 50,117 C50,117 41,114 34,110
           C18,100 6,80 8,62 C10,40 32,26 50,26 Z"
        fill="currentColor"
      />

      {/* === Forehead dark stripe (wolf marking) === */}
      <path d="M44,28 L50,40 L56,28" fill="currentColor" opacity="0.22" />

      {/* === Muzzle — lighter fur area === */}
      <ellipse cx="50" cy="92" rx="24" ry="20" fill="white" opacity="0.14" />

      {/* === Left eye — amber, almond-shaped, angled === */}
      <ellipse
        cx="32" cy="62"
        rx="13" ry="8.5"
        transform="rotate(-20,32,62)"
        fill="#C8800A"
      />
      <ellipse cx="32" cy="62.5" rx="6.5" ry="7" fill="#0e1a0e" />
      <circle cx="29" cy="59" r="2.2" fill="white" opacity="0.65" />

      {/* === Right eye — amber, almond-shaped, angled === */}
      <ellipse
        cx="68" cy="62"
        rx="13" ry="8.5"
        transform="rotate(20,68,62)"
        fill="#C8800A"
      />
      <ellipse cx="68" cy="62.5" rx="6.5" ry="7" fill="#0e1a0e" />
      <circle cx="65" cy="59" r="2.2" fill="white" opacity="0.65" />

      {/* === Nose — triangular, wolf-shaped === */}
      <path
        d="M42,81 L50,74 L58,81 Q58,91 50,94 Q42,91 42,81 Z"
        fill="#1a120a"
      />

      {/* === Mouth lines === */}
      <path d="M50,94 L44,101" stroke="#1a120a" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M50,94 L56,101" stroke="#1a120a" strokeWidth="1.6" strokeLinecap="round" fill="none" />

      {/* === Chin lighter patch === */}
      <ellipse cx="50" cy="110" rx="13" ry="7" fill="white" opacity="0.10" />
    </svg>
  );
}
