import { siteConfig } from "@/lib/config";
import Treeline from "@/components/ui/Treeline";

export default function Footer() {
  return (
    <footer className="border-t border-warm-200 pt-0 pb-10 text-center">
      <Treeline height={60} className="text-warm-200 block" />
      <p className="font-heading text-warm-500 text-sm mt-6">
        Made with love for {siteConfig.babyName} &hearts;
      </p>
      <p className="text-warm-400 text-xs mt-1">
        {new Date().getFullYear()} — a story still being written
      </p>
    </footer>
  );
}
