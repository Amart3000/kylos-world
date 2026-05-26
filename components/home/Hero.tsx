import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { format } from "date-fns";

export default function Hero() {
  return (
    <section className="min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-warm-100 to-warm-50 px-4">
      <div className="max-w-3xl w-full text-center flex flex-col items-center gap-8">
        <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-warm-200 shadow-xl">
          <Image
            src={siteConfig.heroImage}
            alt={siteConfig.fullName}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div>
          <h1 className="font-heading text-6xl sm:text-8xl text-warm-900 leading-none">
            {siteConfig.babyName}
          </h1>
          <p className="mt-3 text-warm-500 text-lg tracking-wide">
            Born {format(siteConfig.birthdate, "MMMM d, yyyy")}
          </p>
        </div>

        <p className="text-warm-600 text-lg max-w-xl leading-relaxed">
          {siteConfig.bio}
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <a
            href="/gallery"
            className="px-6 py-3 bg-accent text-warm-50 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            View Photos
          </a>
          <a
            href="/journal"
            className="px-6 py-3 border border-warm-300 text-warm-700 rounded-full font-medium hover:border-accent hover:text-accent transition-colors"
          >
            Read Letters
          </a>
        </div>
      </div>
    </section>
  );
}
