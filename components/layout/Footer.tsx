import { siteConfig } from "@/lib/config";
import WolfMark from "@/components/ui/WolfMark";

export default function Footer() {
  return (
    <footer className="border-t border-warm-200 py-10 text-center">
      <WolfMark size={64} className="mx-auto text-accent opacity-80 mb-4" />
      <p className="font-heading text-warm-500 text-sm">
        Made with love for {siteConfig.babyName} &hearts;
      </p>
      <p className="text-warm-400 text-xs mt-1">
        {new Date().getFullYear()} — a story still being written
      </p>
    </footer>
  );
}
