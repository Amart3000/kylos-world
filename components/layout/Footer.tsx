import { siteConfig } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-warm-200 py-8 text-center">
      <p className="font-heading text-warm-500 text-sm">
        Made with love for {siteConfig.babyName} &hearts;
      </p>
      <p className="text-warm-400 text-xs mt-1">
        {new Date().getFullYear()} — a story still being written
      </p>
    </footer>
  );
}
