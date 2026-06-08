export default function Treeline({
  height = 72,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  return (
    <svg
      width="100%"
      height={height}
      viewBox="0 0 400 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      {/* Tree 1 — tall, cx=22 */}
      <polygon points="22,8 13,34 31,34" fill="currentColor" />
      <polygon points="22,22 4,78 40,78" fill="currentColor" />

      {/* Tree 2 — short, cx=56 */}
      <polygon points="56,36 50,54 62,54" fill="currentColor" />
      <polygon points="56,46 46,78 66,78" fill="currentColor" />

      {/* Tree 3 — medium, cx=86 */}
      <polygon points="86,22 78,46 94,46" fill="currentColor" />
      <polygon points="86,34 72,78 100,78" fill="currentColor" />

      {/* Tree 4 — very short, cx=114 */}
      <polygon points="114,46 110,60 118,60" fill="currentColor" />
      <polygon points="114,52 106,78 122,78" fill="currentColor" />

      {/* Tree 5 — medium-tall, cx=146 */}
      <polygon points="146,18 138,42 154,42" fill="currentColor" />
      <polygon points="146,30 130,78 162,78" fill="currentColor" />

      {/* Tree 6 — tallest, cx=186 */}
      <polygon points="186,4 175,30 197,30" fill="currentColor" />
      <polygon points="186,16 162,78 210,78" fill="currentColor" />

      {/* Tree 7 — medium, cx=226 */}
      <polygon points="226,26 218,50 234,50" fill="currentColor" />
      <polygon points="226,38 210,78 242,78" fill="currentColor" />

      {/* Tree 8 — short, cx=256 */}
      <polygon points="256,42 251,58 261,58" fill="currentColor" />
      <polygon points="256,50 246,78 266,78" fill="currentColor" />

      {/* Tree 9 — tall, cx=290 */}
      <polygon points="290,12 281,38 299,38" fill="currentColor" />
      <polygon points="290,24 270,78 310,78" fill="currentColor" />

      {/* Tree 10 — medium, cx=326 */}
      <polygon points="326,30 319,52 333,52" fill="currentColor" />
      <polygon points="326,42 310,78 342,78" fill="currentColor" />

      {/* Tree 11 — very short, cx=356 */}
      <polygon points="356,46 352,60 360,60" fill="currentColor" />
      <polygon points="356,52 348,78 364,78" fill="currentColor" />

      {/* Tree 12 — medium-tall, cx=386 */}
      <polygon points="386,22 379,46 393,46" fill="currentColor" />
      <polygon points="386,34 372,78 400,78" fill="currentColor" />
    </svg>
  );
}
