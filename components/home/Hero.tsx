import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { format } from "date-fns";
import ForestMark from "@/components/ui/WolfMark";
import ForestScene from "@/components/ui/WolfHowl";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-warm-100 to-warm-50 px-4 overflow-hidden">

      {/* Large forest scenes — corners */}
      <ForestScene size={220} className="absolute -top-6 -left-10 text-warm-200 rotate-[-10deg] pointer-events-none select-none" />
      <ForestScene size={170} className="absolute -bottom-4 -right-8 text-warm-200 rotate-[170deg] pointer-events-none select-none" />

      {/* Mid-size scenes — opposite corners */}
      <ForestScene size={130} className="absolute top-10 right-6 text-warm-100 rotate-[12deg] pointer-events-none select-none" />
      <ForestScene size={110} className="absolute bottom-10 left-4 text-warm-100 rotate-[-5deg] pointer-events-none select-none" />

      {/* Scattered pine marks */}
      <ForestMark size={52} className="absolute top-6 left-1/3 text-warm-200 rotate-[-6deg] pointer-events-none select-none" />
      <ForestMark size={44} className="absolute bottom-8 right-1/4 text-warm-200 rotate-[10deg] pointer-events-none select-none" />
      <ForestMark size={36} className="absolute top-1/3 right-4 text-warm-100 rotate-[4deg] pointer-events-none select-none" />

      <div className="relative max-w-3xl w-full text-center flex flex-col items-center gap-8">

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
              <ForestMark size={40} className="absolute -left-6 top-1/2 -translate-y-1/2 text-accent opacity-70" />
              <ForestMark size={40} className="absolute -right-6 top-1/2 -translate-y-1/2 text-accent opacity-70" />
            </div>
          </div>
        </div>

        {/* Name + birthdate */}
        <div className="animate-fade-slide-up [animation-delay:200ms]">
          <h1 className="font-heading text-6xl sm:text-8xl text-warm-900 leading-none">
            {siteConfig.babyName}
          </h1>
          <p className="mt-3 text-warm-500 text-lg tracking-wide">
            Born {format(siteConfig.birthdate, "MMMM d, yyyy")}
          </p>
        </div>

        {/* Bio */}
        <p className="text-warm-600 text-lg max-w-xl leading-relaxed animate-fade-slide-up [animation-delay:350ms]">
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
            className="px-7 py-3 border-2 border-warm-300 text-warm-700 rounded-full font-medium hover:border-accent hover:text-accent hover:bg-warm-100 transition-colors duration-200"
          >
            Read Letters
          </a>
        </div>
      </div>
    </section>
  );
}
