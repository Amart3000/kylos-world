"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";
import WolfMark from "@/components/ui/WolfMark";

const links = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/timeline", label: "Timeline" },
  { href: "/journal", label: "Journal" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-warm-200 bg-warm-50/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-xl text-warm-900 hover:text-accent transition-colors"
        >
          <WolfMark size={26} className="text-accent" />
          {siteConfig.siteName}
        </Link>
        <nav className="flex gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                pathname === href
                  ? "text-accent"
                  : "text-warm-600"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
