import { siteConfig } from "@/lib/config";
import Treeline from "@/components/ui/Treeline";

export default function Footer() {
  return (
    <footer className="border-t border-white/15 pt-0 pb-10 text-center bg-warm-900/50 backdrop-blur-sm">
      <Treeline height={60} className="text-warm-700/70 block" />
      <p className="font-heading text-warm-200 text-sm mt-6">
        Made with love for {siteConfig.babyName} &hearts;
      </p>
      <p className="text-warm-300/70 text-xs mt-1">
        {new Date().getFullYear()} — a story still being written
      </p>
    </footer>
  );
}
