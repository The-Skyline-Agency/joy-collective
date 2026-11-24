"use client";

import { useRef } from "react";
import Image from "next/image";
import { Instrument_Serif, Inter_Tight } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import EmailForm from "./EmailForm";
import { bio, disclaimer, INSTAGRAM, mission, pillars, quote, story, SUBSTACK } from "./content";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Mockup C type: a condensed editorial serif like her Instagram quote posts, with a tight grotesk for UI (Soma reference).
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-c-serif" });
const grotesk = Inter_Tight({ subsets: ["latin"], variable: "--font-c-sans" });

// Her own words, from her Instagram quote posts and Substack header.
const quotes = [
  "Healing is not a destination. It is just deciding every day to know yourself a little better than you did yesterday.",
  "The life I was meant to live started the moment I stopped performing the one I thought I should.",
  quote,
];

function Sun({ className = "", size = 22 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden className={className}>
      <circle cx="11" cy="11" r="4.5" fill="currentColor" />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x="10.3" y="0.5" width="1.4" height="3.6" rx="0.7" fill="currentColor" transform={`rotate(${i * 45} 11 11)`} />
      ))}
    </svg>
  );
}

// Small numbered label with a hairline that draws in on scroll.
function Label({ n, children, center = false }: { n: string; children: React.ReactNode; center?: boolean }) {
  return (
    <div className={`mb-10 flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-[#2f382b]/55 ${center ? "mx-auto max-w-md" : ""}`}>
      <span>{n}</span>
      <span className="c-rule h-px flex-1 bg-[#2f382b]/20" />
      <span>{children}</span>
    </div>
  );
}

export default function MockupC() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Words, not letters: per-letter spans drop kerning and the spacing jumps when the split is removed.
        const title = SplitText.create(".c-title", { type: "words", mask: "words" });
        gsap.set(title.masks, { paddingBottom: "0.15em", marginBottom: "-0.15em" });
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(title.words, { yPercent: 120, duration: 1.3, stagger: 0.08, onComplete: () => title.revert() })
          .from(".c-fade", { autoAlpha: 0, y: 16, duration: 1, stagger: 0.1 }, 0.5);

        // Photo opens from an inset card to full bleed as it scrolls in.
        gsap.fromTo(
          ".c-reveal",
          { clipPath: "inset(0% 12% 0% 12% round 28px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: ".c-reveal", start: "top 85%", end: "top 15%", scrub: true } },
        );
        gsap.fromTo(".c-reveal img", { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".c-reveal", start: "top bottom", end: "bottom top", scrub: true } });

        // Sticky signup pill: shown after the hero form scrolls away, hidden again while the closing form is on screen.
        gsap.set(".c-sticky", { autoAlpha: 0, y: -16 });
        let pastHero = false;
        let atJoin = false;
        const syncSticky = () => {
          const on = pastHero && !atJoin;
          gsap.to(".c-sticky", { autoAlpha: on ? 1 : 0, y: on ? 0 : -16, duration: on ? 0.4 : 0.3, ease: "power2.out", overwrite: true });
        };
        ScrollTrigger.create({ trigger: ".c-hero-form", start: "bottom top", onToggle: (self) => { pastHero = self.isActive || self.progress === 1; syncSticky(); }, end: "max" });
        ScrollTrigger.create({ trigger: ".c-join-form", start: "top bottom", end: "max", onToggle: (self) => { atJoin = self.isActive || self.progress === 1; syncSticky(); } });

        // Centered statement lights up word by word.
        const st = SplitText.create(".c-statement", { type: "words" });
        gsap.fromTo(st.words, { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".c-statement", start: "top 75%", end: "bottom 45%", scrub: true } });

        // clearProps hands transform back to CSS so the hover lift works after the entrance.
        gsap.from(".c-quote", { autoAlpha: 0, y: 60, rotate: (i) => [-2, 1.5, -1][i] ?? 0, stagger: 0.15, duration: 1.1, ease: "power3.out", clearProps: "transform", scrollTrigger: { trigger: ".c-quotes", start: "top 75%" } });

        // Ambient details: drifting glows, a slowly turning badge and sun, the footer wordmark rising in.
        gsap.to(".c-glow-a", { xPercent: 18, yPercent: 12, duration: 14, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(".c-glow-b", { xPercent: -15, yPercent: -10, duration: 17, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(".c-badge", { rotate: 360, duration: 40, ease: "none", repeat: -1 });
        gsap.to(".c-sun", { rotate: 360, duration: 60, ease: "none", repeat: -1 });
        gsap.utils.toArray<HTMLElement>(".c-rule").forEach((el) => {
          gsap.from(el, { scaleX: 0, transformOrigin: "left center", duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
        });
        gsap.from(".c-wordmark", { yPercent: 40, autoAlpha: 0, duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: ".c-wordmark", start: "top 95%" } });

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, { autoAlpha: 0, y: 30, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
        });
        gsap.fromTo(".c-portrait img", { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".c-portrait", scrub: true } });
      });

      // Without motion the sticky bar should still be usable.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        ScrollTrigger.create({ trigger: ".c-hero-form", start: "bottom top", toggleClass: { targets: ".c-sticky", className: "c-sticky-on" } });
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);
      return () => window.removeEventListener("load", refresh);
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`${serif.variable} ${grotesk.variable} c-root min-h-screen bg-[#f6f3ea] pb-28 text-[#2f382b]`}>
      <div className="c-grain" aria-hidden />

      {/* HEADER */}
      <header className="relative z-20 flex items-center justify-between px-5 py-6 sm:px-10">
        <span className="c-serif text-[26px] leading-none">the joy collective</span>
        <Sun className="hidden sm:block" />
        <nav className="flex gap-6 text-sm">
          <a href="#c-mission" className="hover:opacity-60">Mission</a>
          <a href="#c-founder" className="hover:opacity-60">Founder</a>
        </nav>
      </header>

      {/* Sticky signup */}
      <div className="c-sticky invisible fixed inset-x-0 top-4 z-40 flex justify-center px-4">
        <EmailForm tone="stone" compact />
      </div>

      {/* HERO */}
      <section className="relative flex min-h-[78svh] flex-col items-center justify-center overflow-hidden px-5 pb-16 text-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
          <div className="c-glow-a absolute left-[8%] top-[10%] h-[38vw] w-[38vw] rounded-full bg-[#dfe6cc] opacity-70 blur-[90px]" />
          <div className="c-glow-b absolute bottom-[0%] right-[6%] h-[32vw] w-[32vw] rounded-full bg-[#cbd9b8] opacity-70 blur-[90px]" />
        </div>
        <div aria-hidden className="absolute bottom-10 right-10 hidden h-28 w-28 md:block">
          <svg viewBox="0 0 120 120" className="c-badge h-full w-full text-[#2f382b]/55">
            <defs><path id="c-badge-path" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
            <text fontSize="9.5" letterSpacing="3.2" fill="currentColor"><textPath href="#c-badge-path">SMALL CIRCLES · REAL CONVERSATIONS · LITTLE JOYS · </textPath></text>
          </svg>
          <Sun size={18} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2f382b]/70" />
        </div>
        <div className="relative z-10 flex w-full flex-col items-center">
        <p className="c-fade mb-6 text-xs uppercase tracking-[0.3em] text-[#2f382b]/60">A circle for women · Opening November 30</p>
        <h1 className="c-title c-serif max-w-4xl text-[clamp(3.2rem,8.5vw,7.5rem)] leading-[0.95] tracking-[-0.01em]">
          Choose joy, <em>together.</em>
        </h1>
        <p className="c-fade mt-7 max-w-md text-[17px] leading-relaxed text-[#2f382b]/75">
          Small groups of women having real conversations about the hard stuff.
        </p>
        <div className="c-fade c-hero-form mt-9 flex w-full justify-center"><EmailForm tone="stone" /></div>
        </div>
      </section>

      {/* FULL-BLEED PHOTO */}
      <div className="c-reveal relative h-[85svh] overflow-hidden">
        <Image src="/media/friends-park.jpg" alt="Two women talking and laughing in a sunlit park" fill sizes="100vw" className="object-cover object-[50%_35%]" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[#2f382b]/45 to-transparent px-6 pb-6 pt-24 text-[#f6f3ea] sm:px-10 sm:pb-8">
          <p className="c-serif text-2xl italic sm:text-3xl">A conversation that didn&apos;t need to be perfect.</p>
          <p className="hidden text-[11px] uppercase tracking-[0.3em] opacity-80 sm:block">Little moments, noticed</p>
        </div>
      </div>

      {/* MISSION: two columns, grotesk heading + serif body */}
      <section id="c-mission" className="mx-auto max-w-6xl px-5 py-28 sm:px-10 md:py-36">
        <Label n="01">Our mission</Label>
        <div className="grid gap-10 md:grid-cols-2 md:gap-20">
        <h2 data-reveal className="c-sans text-[clamp(2rem,3.6vw,3rem)] font-normal leading-[1.05] tracking-[-0.035em]">
          Some days are heavy, and you can&apos;t say why
        </h2>
        <div>
          <p data-reveal className="c-serif text-[clamp(1.3rem,1.8vw,1.6rem)] leading-[1.4]">{mission}</p>
          <ul data-reveal className="mt-10 divide-y divide-[#2f382b]/15 border-y border-[#2f382b]/15">
            {pillars.map((p, i) => (
              <li key={p.title} className="grid grid-cols-[3rem_1fr] gap-2 py-5">
                <span className="text-sm text-[#2f382b]/50">0{i + 1}</span>
                <div>
                  <h3 className="text-[17px] font-medium tracking-[-0.01em]">{p.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#2f382b]/70">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="flex min-h-[70svh] flex-col items-center justify-center gap-10 bg-[#e8edda] px-5">
        <Sun size={34} className="c-sun text-[#2f382b]/80" />
        <p className="c-statement c-sans max-w-3xl text-center text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.1] tracking-[-0.035em]">
          You don&apos;t have to carry it alone. The joy is in the little moments, and in the people you share them with.
        </p>
      </section>

      {/* QUOTE CARDS in the style of her Instagram posts */}
      <section className="c-quotes mx-auto max-w-6xl px-5 py-20 sm:px-10">
        <Label n="02">From Adriana</Label>
        <div className="grid gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q} className="c-quote flex aspect-square flex-col items-center justify-between bg-[#e6ebd8] p-8 text-center ring-1 ring-[#2f382b]/[0.07] shadow-[0_14px_30px_-26px_rgba(30,29,25,0.25)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:-rotate-[0.6deg] hover:shadow-[0_22px_40px_-28px_rgba(30,29,25,0.3)]">
              <span />
              <blockquote className="c-serif text-[clamp(1.5rem,2.2vw,1.9rem)] leading-[1.12]">{q}</blockquote>
              <figcaption className="text-[10px] uppercase tracking-[0.3em] text-[#2f382b]/60">@withadrianacox</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-10 md:py-32">
        <Label n="03" center>Our story</Label>
        <h2 data-reveal className="c-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[1]">Where the joy comes from</h2>
        <p data-reveal className="mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-[#2f382b]/75">{story}</p>
      </section>

      {/* FOUNDER */}
      <section id="c-founder" className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-10 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
        <div data-reveal className="relative mb-12 mr-6 md:mb-0">
          <div className="c-portrait relative aspect-[2/3] overflow-hidden rounded-[4px]">
            <Image src="/media/adriana-bench.jpg" alt="Adriana Cox smiling, seated on a wooden bench" fill sizes="(min-width: 768px) 45vw, 100vw" className="scale-110 object-cover object-top" />
          </div>
          <div className="absolute -bottom-12 -right-6 aspect-[3/4] w-[38%] overflow-hidden rounded-[4px] ring-[6px] ring-[#f6f3ea]">
            <Image src="/media/adriana-studio.jpg" alt="Adriana Cox in a black pleated top and wide trousers, studio portrait" fill sizes="20vw" className="object-cover object-[50%_10%]" />
          </div>
        </div>
        <div>
          <Label n="04">Founder</Label>
          <h2 data-reveal className="c-serif text-[clamp(3rem,6vw,5.2rem)] leading-[0.95]">Adriana Cox</h2>
          <p data-reveal className="c-serif mt-3 text-xl italic text-[#2f382b]/70">Normalizing mental health through honest storytelling.</p>
          <dl data-reveal className="mt-8 grid max-w-lg grid-cols-2 gap-px overflow-hidden rounded-[4px] bg-[#2f382b]/12 text-sm">
            <div className="bg-[#f6f3ea] py-3 pr-4"><dt className="text-[11px] uppercase tracking-[0.2em] text-[#2f382b]/55">Founder</dt><dd className="mt-1">The Joy Collective</dd></div>
            <div className="bg-[#f6f3ea] py-3 pl-4"><dt className="text-[11px] uppercase tracking-[0.2em] text-[#2f382b]/55">Vice Chair</dt><dd className="mt-1">LA Chargers Impact Fund</dd></div>
          </dl>
          <p data-reveal className="mt-8 max-w-lg text-[17px] leading-relaxed text-[#2f382b]/75">{bio}</p>
          <div data-reveal className="mt-10 flex flex-wrap gap-3 text-sm">
            <a href={SUBSTACK} target="_blank" rel="noreferrer" className="rounded-full bg-[#5e7652] px-6 py-3 text-[#f6f3ea] transition-colors hover:bg-[#3f4f37]">Read on Substack</a>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="rounded-full border border-[#2f382b]/25 px-6 py-3 transition-colors hover:border-[#2f382b]">@withadrianacox</a>
          </div>
        </div>
      </section>

      {/* JOIN */}
      <section className="flex flex-col items-center px-5 py-32 text-center md:py-44">
        <h2 data-reveal className="c-serif max-w-3xl text-[clamp(2.8rem,6.5vw,5.8rem)] leading-[0.98]">
          Save a seat in the <em>first circle</em>
        </h2>
        <div data-reveal className="c-join-form mt-10 flex w-full justify-center"><EmailForm tone="stone" /></div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-[#2f382b]/15 px-5 pt-8 text-xs text-[#2f382b]/65 sm:px-10 md:flex-row md:justify-between">
        <p className="max-w-md leading-relaxed">{disclaimer}</p>
        <p>joycollective.org</p>
      </footer>
      <div aria-hidden className="mt-16 overflow-hidden px-3 text-center">
        <p className="c-wordmark c-serif whitespace-nowrap pb-[0.12em] text-[17vw] leading-[0.9] tracking-[-0.03em] text-[#5e7652]/85">joy collective</p>
      </div>
    </div>
  );
}
