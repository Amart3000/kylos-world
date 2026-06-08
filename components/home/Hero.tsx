import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { format } from "date-fns";
import ForestMark from "@/components/ui/WolfMark";

export default function Hero() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center px-4 py-12">
      <div className="relative max-w-2xl w-full text-center flex flex-col items-center gap-8 rounded-3xl px-8 py-12 bg-white/35 backdrop-blur-md shadow-2xl border border-white/45">

        {/* Floating photo with pulse ring */}
        <div className="animate-fade-slide-up [animation-delay:0ms]">
          <div className="animate-float">
            <div className="relative">
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-accent shadow-xl animate-pulse-ring">
                <Image
                  src={siteConfig.heroImage}
                  alt={siteConfig.fullName}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <ForestMark size={38} className="absolute -left-6 top-1/2 -translate-y-1/2 text-accent opacity-80" />
              <ForestMark size={38} className="absolute -right-6 top-1/2 -translate-y-1/2 text-accent opacity-80" />
            </div>
          </div>
        </div>

        {/* Name + birthdate */}
        <div className="animate-fade-slide-up [animation-delay:200ms]">
          <h1 className="font-heading text-6xl sm:text-8xl text-warm-900 leading-none drop-shadow-sm">
            {siteConfig.babyName}
          </h1>
          <p className="mt-3 text-warm-700 text-lg tracking-wide">
            Born {format(siteConfig.birthdate, "MMMM d, yyyy")}
          </p>
        </div>

        {/* Bio */}
        <p className="text-warm-800 text-lg max-w-xl leading-relaxed animate-fade-slide-up [animation-delay:350ms]">
          {siteConfig.bio}
        </p>

        {/* CTAs */}
        <div className="flex gap-4 flex-wrap justify-center animate-fade-slide-up [animation-delay:500ms]">
          <a
            href="/gallery"
            className="btn-shimmer px-7 py-3 bg-accent text-warm-50 rounded-full font-medium shadow-md hover:shadow-lg hover:opacity-95 transition-all duration-200"
          >
            View Photos
          </a>
          <a
            href="/journal"
            className="px-7 py-3 border-2 border-white/60 bg-white/30 text-warm-900 rounded-full font-medium hover:bg-white/50 hover:border-white/80 transition-all duration-200 backdrop-blur-sm"
          >
            Read Letters
          </a>
        </div>
      </div>
    </section>
  );
}
