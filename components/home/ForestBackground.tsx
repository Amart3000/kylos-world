"use client";
import { useEffect, useRef } from "react";

export interface ForestBackgroundProps {
  /** When true the canvas captures clicks and bursts sparkles. Default: false. */
  interactive?: boolean;
  /** CSS position strategy. "fixed" covers the full viewport; "absolute" fills the nearest positioned ancestor. */
  position?: "fixed" | "absolute";
}

// Stable tree positions computed once at module load (no Math.random — avoids hydration mismatch)
const FAR_TREES = Array.from({ length: 26 }, (_, i) => ({
  x: i * 46 + (i % 5 === 1 ? 9 : i % 5 === 3 ? -7 : 0),
  h: 52 + (i % 7) * 9,
}));

const MID_TREES = Array.from({ length: 17 }, (_, i) => ({
  x: i * 74 + (i % 4 === 1 ? 14 : i % 4 === 3 ? -10 : 0),
  h: 108 + (i % 6) * 17,
}));

export default function ForestBackground({
  interactive = false,
  position = "fixed",
}: ForestBackgroundProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // --- Fireflies ---
    const fireflies = Array.from({ length: 24 }, () => ({
      x: Math.random() * canvas!.offsetWidth,
      y: canvas!.offsetHeight * 0.48 + Math.random() * canvas!.offsetHeight * 0.52,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.28,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.014 + Math.random() * 0.018,
      size: 1.5 + Math.random() * 1.5,
    }));

    // --- Birds ---
    const birds = Array.from({ length: 5 }, (_, i) => ({
      x: -100 - i * 200,
      y: 28 + Math.random() * 110,
      vx: 0.55 + Math.random() * 0.5,
      wing: 0,
      wingDir: 1,
      wingSpeed: 0.07 + Math.random() * 0.05,
      scale: 0.65 + Math.random() * 0.7,
    }));

    // --- Falling leaves ---
    const leafPalette = ["#2d6e3f", "#3d7a4a", "#4a8a56", "#245238", "#1e5c34"];
    const leaves = Array.from({ length: 20 }, () => ({
      x: Math.random() * (canvas?.offsetWidth ?? 900),
      y: Math.random() * (canvas?.offsetHeight ?? 700),
      vx: (Math.random() - 0.5) * 0.38,
      vy: 0.32 + Math.random() * 0.48,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      size: 4 + Math.random() * 5,
      color: leafPalette[Math.floor(Math.random() * leafPalette.length)],
      opacity: 0.42 + Math.random() * 0.38,
      sway: Math.random() * Math.PI * 2,
    }));

    // --- Herd: deer + bear + wolf run across together (staggered) ---
    type Runner = {
      kind: "deer" | "bear" | "wolf";
      x: number;
      offset: number; // horizontal offset relative to group leader
      active: boolean;
      vx: number;
    };
    const herd: Runner[] = [
      { kind: "deer", x: -160, offset: 0, active: false, vx: 0 },
      { kind: "wolf", x: -160, offset: -70, active: false, vx: 0 },
      { kind: "bear", x: -160, offset: -150, active: false, vx: 0 },
    ];
    let herdTimeout: ReturnType<typeof setTimeout>;
    function scheduleHerd() {
      herdTimeout = setTimeout(() => {
        const vx = 2.2 + Math.random() * 1.2;
        for (const r of herd) {
          r.active = true;
          r.vx = vx;
          r.x = -160 + r.offset;
        }
        scheduleHerd();
      }, 12000 + Math.random() * 18000);
    }
    scheduleHerd();

    // --- Click sparkles ---
    type Sparkle = { x: number; y: number; vx: number; vy: number; life: number; size: number; color: string };
    let sparkles: Sparkle[] = [];
    const sparkPalette = ["#ffe680", "#80ffaa", "#7eefff", "#ffb380", "#ffaaff", "#ffffff", "#aaffcc"];

    function handleClick(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const speed = 2.5 + Math.random() * 3.5;
        sparkles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: 2.5 + Math.random() * 3.5,
          color: sparkPalette[Math.floor(Math.random() * sparkPalette.length)],
        });
      }
    }
    if (interactive) canvas.addEventListener("click", handleClick);

    // --- Species draw helpers (origin = ground contact at the runner's feet) ---
    function drawLegs(c: CanvasRenderingContext2D, positions: [number, number][], t: number, top: number, len: number) {
      c.lineCap = "round";
      for (const [lx, phase] of positions) {
        c.beginPath();
        c.moveTo(lx, top);
        c.lineTo(lx + Math.sin(t + phase) * 6, top + len);
        c.stroke();
      }
    }

    function drawDeer(c: CanvasRenderingContext2D, t: number) {
      c.fillStyle = "rgba(78, 50, 28, 0.88)";
      c.strokeStyle = "rgba(78, 50, 28, 0.88)";
      c.beginPath(); c.ellipse(0, -14, 22, 10, 0, 0, Math.PI * 2); c.fill();        // body
      c.beginPath(); c.ellipse(22, -23, 9, 7, 0.3, 0, Math.PI * 2); c.fill();       // head
      c.beginPath(); c.ellipse(29, -22, 4.5, 3.5, 0.2, 0, Math.PI * 2); c.fill();   // snout
      c.lineWidth = 6;
      c.beginPath(); c.moveTo(13, -18); c.lineTo(17, -18); c.stroke();              // neck
      c.lineWidth = 3.5;
      drawLegs(c, [[14, 1], [18, -1], [-7, 1], [-12, -1]], t, -4, 16);
      // antlers
      c.lineWidth = 1.8;
      c.beginPath();
      c.moveTo(18, -27); c.lineTo(15, -40); c.lineTo(10, -45);
      c.moveTo(15, -40); c.lineTo(19, -46);
      c.moveTo(20, -27); c.lineTo(23, -38); c.lineTo(28, -42);
      c.moveTo(23, -38); c.lineTo(19, -43);
      c.stroke();
      // tail
      c.lineWidth = 3;
      c.beginPath(); c.moveTo(-22, -16); c.lineTo(-27, -19); c.stroke();
    }

    function drawWolf(c: CanvasRenderingContext2D, t: number) {
      c.fillStyle = "rgba(70, 74, 82, 0.85)";
      c.strokeStyle = "rgba(70, 74, 82, 0.85)";
      // body (lower, longer than deer)
      c.beginPath(); c.ellipse(0, -10, 21, 7.5, 0, 0, Math.PI * 2); c.fill();
      // head — angular, lower than deer
      c.beginPath(); c.ellipse(20, -14, 8, 5.5, 0.15, 0, Math.PI * 2); c.fill();
      // muzzle
      c.beginPath(); c.ellipse(27, -13, 4, 2.5, 0.1, 0, Math.PI * 2); c.fill();
      // ears (triangular, perked)
      c.beginPath();
      c.moveTo(17, -19); c.lineTo(15, -24); c.lineTo(20, -20); c.closePath(); c.fill();
      c.beginPath();
      c.moveTo(22, -19); c.lineTo(21, -24); c.lineTo(25, -20); c.closePath(); c.fill();
      // legs (shorter, thinner stride)
      c.lineWidth = 2.8;
      drawLegs(c, [[13, 1], [16, -1], [-7, 1], [-11, -1]], t, -3, 13);
      // bushy tail
      c.lineWidth = 5;
      c.beginPath();
      c.moveTo(-20, -12);
      c.quadraticCurveTo(-28, -16, -30, -10);
      c.stroke();
    }

    function drawBear(c: CanvasRenderingContext2D, t: number) {
      c.fillStyle = "rgba(58, 38, 22, 0.92)";
      c.strokeStyle = "rgba(58, 38, 22, 0.92)";
      // big chunky body
      c.beginPath(); c.ellipse(0, -16, 28, 13, 0, 0, Math.PI * 2); c.fill();
      // shoulder hump
      c.beginPath(); c.ellipse(-6, -25, 11, 7, 0, 0, Math.PI * 2); c.fill();
      // head (round)
      c.beginPath(); c.ellipse(26, -20, 10, 8.5, 0, 0, Math.PI * 2); c.fill();
      // snout
      c.beginPath(); c.ellipse(33, -18, 5, 4, 0, 0, Math.PI * 2); c.fill();
      // round ears
      c.beginPath(); c.arc(21, -28, 3, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(30, -28, 3, 0, Math.PI * 2); c.fill();
      // thick stubby legs
      c.lineWidth = 5;
      drawLegs(c, [[16, 1], [21, -1], [-10, 1], [-16, -1]], t, -5, 14);
    }

    let animId: number;

    function draw() {
      const W = canvas!.width;
      const H = canvas!.height;
      ctx!.clearRect(0, 0, W, H);

      // Fireflies
      for (const f of fireflies) {
        f.x += f.vx;
        f.y += f.vy;
        f.phase += f.phaseSpeed;
        const glow = (Math.sin(f.phase) + 1) * 0.5;
        if (f.x < 0) f.x = W;
        if (f.x > W) f.x = 0;
        if (f.y < H * 0.42) f.y = H;
        if (f.y > H) f.y = H * 0.42;
        ctx!.beginPath();
        ctx!.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(210, 255, 120, ${glow * 0.88})`;
        ctx!.shadowColor = "rgba(180, 255, 80, 0.95)";
        ctx!.shadowBlur = 14;
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }

      // Birds
      for (const b of birds) {
        b.x += b.vx;
        b.wing += b.wingDir * b.wingSpeed;
        if (Math.abs(b.wing) > 1) b.wingDir *= -1;
        if (b.x > W + 100) {
          b.x = -80;
          b.y = 22 + Math.random() * 130;
        }
        const wY = b.wing * 4.5 * b.scale;
        ctx!.strokeStyle = "rgba(12, 38, 18, 0.6)";
        ctx!.lineWidth = 1.6 * b.scale;
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.moveTo(b.x - 8 * b.scale, b.y + wY);
        ctx!.quadraticCurveTo(b.x, b.y - 2 * b.scale, b.x + 8 * b.scale, b.y + wY);
        ctx!.stroke();
      }

      // Leaves
      for (const l of leaves) {
        l.sway += 0.011;
        l.x += l.vx + Math.sin(l.sway) * 0.28;
        l.y += l.vy;
        l.rotation += l.rotSpeed;
        if (l.y > H + 22) { l.y = -22; l.x = Math.random() * W; }
        ctx!.save();
        ctx!.translate(l.x, l.y);
        ctx!.rotate(l.rotation);
        ctx!.globalAlpha = l.opacity;
        ctx!.fillStyle = l.color;
        ctx!.beginPath();
        ctx!.ellipse(0, 0, l.size, l.size * 0.42, 0, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }
      ctx!.globalAlpha = 1;

      // Herd (deer, wolf, bear) — run at H*0.82 so footer doesn't clip them.
      const groundY = H * 0.82;
      const tHerd = Date.now() * 0.012;
      for (const r of herd) {
        if (!r.active) continue;
        r.x += r.vx;
        ctx!.save();
        ctx!.translate(r.x, groundY);
        if (r.kind === "deer") drawDeer(ctx!, tHerd);
        else if (r.kind === "wolf") drawWolf(ctx!, tHerd);
        else drawBear(ctx!, tHerd);
        ctx!.restore();
        if (r.x > W + 200) r.active = false;
      }

      // Sparkles
      sparkles = sparkles.filter((s) => s.life > 0);
      for (const s of sparkles) {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.14;
        s.vx *= 0.97;
        s.life -= 0.02;
        const r = s.size * Math.max(s.life, 0);
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = s.color;
        ctx!.globalAlpha = Math.max(s.life, 0);
        ctx!.shadowColor = s.color;
        ctx!.shadowBlur = 8;
        ctx!.fill();
        ctx!.shadowBlur = 0;
        ctx!.globalAlpha = 1;
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(herdTimeout);
      if (interactive) canvas!.removeEventListener("click", handleClick);
      ro.disconnect();
    };
  }, [interactive]);

  return (
    <div
      className="inset-0 overflow-hidden"
      style={{ position, zIndex: position === "fixed" ? -1 : 0 }}
    >
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #a6d8f0 0%, #c2e8d2 32%, #78bf8e 54%, #4a9e62 70%, #286e3e 84%, #143c22 100%)",
        }}
      />

      {/* Sun */}
      <div
        className="absolute"
        style={{
          top: "7%", right: "13%",
          width: 70, height: 70,
          borderRadius: "50%",
          background: "radial-gradient(circle, #fffde6 22%, #ffe566 62%, transparent 100%)",
          boxShadow: "0 0 72px 36px rgba(255, 228, 80, 0.2)",
        }}
      />

      {/* Animated clouds */}
      <div className="absolute animate-cloud-slow" style={{ top: "7%", left: "-8%", width: 160, height: 50, background: "rgba(255,255,255,0.76)", borderRadius: 30, filter: "blur(3px)" }} />
      <div className="absolute animate-cloud-med"  style={{ top: "14%", left: "-12%", width: 115, height: 36, background: "rgba(255,255,255,0.64)", borderRadius: 20, filter: "blur(2px)" }} />
      <div className="absolute animate-cloud-fast" style={{ top: "4%",  left: "-16%", width: 88,  height: 28, background: "rgba(255,255,255,0.52)", borderRadius: 14, filter: "blur(2px)" }} />

      {/* Far background trees */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1200 250"
        preserveAspectRatio="none"
        style={{ height: "42%" }}
      >
        {FAR_TREES.map((tr, i) => (
          <g key={i} opacity={0.44}>
            <polygon points={`${tr.x},${250 - tr.h} ${tr.x - 14},250 ${tr.x + 14},250`} fill="#7cc491" />
            <polygon points={`${tr.x},${250 - tr.h * 0.58} ${tr.x - 10},${250 - tr.h * 0.22} ${tr.x + 10},${250 - tr.h * 0.22}`} fill="#6ab47e" />
          </g>
        ))}
      </svg>

      {/* Mid trees */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1200 360"
        preserveAspectRatio="none"
        style={{ height: "56%" }}
      >
        {MID_TREES.map((tr, i) => (
          <g key={i} opacity={0.8}>
            <polygon points={`${tr.x},${360 - tr.h} ${tr.x - 24},360 ${tr.x + 24},360`} fill="#4d9062" />
            <polygon points={`${tr.x},${360 - tr.h * 0.6} ${tr.x - 18},${360 - tr.h * 0.24} ${tr.x + 18},${360 - tr.h * 0.24}`} fill="#3c7a50" />
            <rect x={tr.x - 5} y={360 - 26} width={10} height={26} fill="#295a3a" />
          </g>
        ))}
      </svg>

      {/* River */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        style={{ height: "30%", opacity: 0.88 }}
      >
        <path d="M0,72 C100,55 220,90 380,68 C540,46 650,82 800,60 C940,38 1060,72 1200,56 L1200,200 L0,200 Z" fill="rgba(88,168,212,0.42)" />
        <path d="M0,88 C120,74 240,104 400,82 C560,60 665,96 815,76 C955,56 1075,86 1200,70 L1200,100 C1075,116 955,86 815,106 C665,126 560,90 400,112 C240,134 120,104 0,118 Z" fill="rgba(108,188,232,0.2)" />
      </svg>

      {/* Boulders */}
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
        style={{ height: "14%" }}
      >
        <ellipse cx="312" cy="82" rx="48" ry="26" fill="#3a5040" opacity="0.84" />
        <ellipse cx="334" cy="76" rx="28" ry="16" fill="#4c6452" opacity="0.72" />
        <ellipse cx="898" cy="80" rx="40" ry="22" fill="#3a5040" opacity="0.84" />
        <ellipse cx="876" cy="74" rx="22" ry="13" fill="#4c6452" opacity="0.72" />
      </svg>

      {/* Left foreground tree cluster */}
      <svg
        className="absolute left-0 bottom-0 animate-sway-left"
        viewBox="0 0 260 560"
        preserveAspectRatio="xMinYMax meet"
        style={{ width: "19%", minWidth: 110, height: "70%" }}
      >
        <polygon points="72,0 22,175 122,175"   fill="#19572e" />
        <polygon points="72,86 4,278 140,278"   fill="#154e28" />
        <polygon points="72,174 0,378 144,378"  fill="#114422" />
        <rect x="60" y="378" width="24" height="68" fill="#0b2c17" />
        <polygon points="178,55 148,210 208,210"  fill="#19572e" opacity="0.88" />
        <polygon points="178,140 132,312 224,312" fill="#154e28" opacity="0.88" />
        <rect x="170" y="312" width="16" height="52" fill="#0b2c17" opacity="0.88" />
        <polygon points="245,96 226,234 264,234"  fill="#19572e" opacity="0.65" />
        <polygon points="245,178 218,338 272,338" fill="#154e28" opacity="0.65" />
      </svg>

      {/* Right foreground tree cluster */}
      <svg
        className="absolute right-0 bottom-0 animate-sway-right"
        viewBox="0 0 260 560"
        preserveAspectRatio="xMaxYMax meet"
        style={{ width: "19%", minWidth: 110, height: "70%" }}
      >
        <polygon points="188,0 138,175 238,175"   fill="#19572e" />
        <polygon points="188,86 120,278 256,278"  fill="#154e28" />
        <polygon points="188,174 116,378 260,378" fill="#114422" />
        <rect x="176" y="378" width="24" height="68" fill="#0b2c17" />
        <polygon points="82,55 52,210 112,210"    fill="#19572e" opacity="0.88" />
        <polygon points="82,140 36,312 128,312"   fill="#154e28" opacity="0.88" />
        <rect x="74" y="312" width="16" height="52" fill="#0b2c17" opacity="0.88" />
        <polygon points="15,96 -4,234 34,234"     fill="#19572e" opacity="0.65" />
        <polygon points="15,178 -12,338 42,338"   fill="#154e28" opacity="0.65" />
      </svg>

      {/* Ground */}
      <div
        className="absolute bottom-0 w-full"
        style={{ height: "11%", background: "linear-gradient(to top, #0c2c18 0%, #194c28 55%, transparent 100%)" }}
      />

      {/* Canvas — ambient animations; click sparkles only when interactive=true */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: interactive ? "auto" : "none",
          cursor: interactive ? "crosshair" : "default",
        }}
        title={interactive ? "Click anywhere for a surprise!" : undefined}
      />
    </div>
  );
}
