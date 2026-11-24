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

        // Sticky signup pill appears once the hero form has scrolled away.
        gsap.set(".c-sticky", { autoAlpha: 0, y: -16 });
        ScrollTrigger.create({
          trigger: ".c-hero-form",
          start: "bottom top",
          onEnter: () => gsap.to(".c-sticky", { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }),
          onLeaveBack: () => gsap.to(".c-sticky", { autoAlpha: 0, y: -16, duration: 0.3 }),
        });

        // Centered statement lights up word by word.
        const st = SplitText.create(".c-statement", { type: "words" });
        gsap.fromTo(st.words, { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".c-statement", start: "top 75%", end: "bottom 45%", scrub: true } });

        gsap.from(".c-quote", { autoAlpha: 0, y: 60, rotate: (i) => [-2, 1.5, -1][i] ?? 0, stagger: 0.15, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: ".c-quotes", start: "top 75%" } });

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
    <div ref={root} className={`${serif.variable} ${grotesk.variable} c-root min-h-screen bg-[#f6f3ec] pb-28 text-[#1e1d19]`}>
      {/* HEADER */}
      <header className="relative z-20 flex items-center justify-between px-5 py-6 sm:px-10">
        <span className="c-serif text-[26px] leading-none">the joy collective</span>
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden className="hidden sm:block">
          <circle cx="11" cy="11" r="4.5" fill="currentColor" />
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x="10.3" y="0.5" width="1.4" height="3.6" rx="0.7" fill="currentColor" transform={`rotate(${i * 45} 11 11)`} />
          ))}
        </svg>
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
      <section className="flex min-h-[78svh] flex-col items-center justify-center px-5 pb-16 text-center">
        <p className="c-fade mb-6 text-xs uppercase tracking-[0.3em] text-[#1e1d19]/60">A circle for women · Opening November 30</p>
        <h1 className="c-title c-serif max-w-4xl text-[clamp(3.2rem,8.5vw,7.5rem)] leading-[0.95] tracking-[-0.01em]">
          Choose joy, <em>together.</em>
        </h1>
        <p className="c-fade mt-7 max-w-md text-[17px] leading-relaxed text-[#1e1d19]/75">
          Small groups of women having real conversations about the hard stuff.
        </p>
        <div className="c-fade c-hero-form mt-9 flex w-full justify-center"><EmailForm tone="stone" /></div>
      </section>

      {/* FULL-BLEED PHOTO */}
      <div className="c-reveal relative h-[85svh] overflow-hidden">
        <Image src="/media/friends-park.jpg" alt="Two women talking and laughing in a sunlit park" fill sizes="100vw" className="object-cover object-[50%_35%]" />
      </div>

      {/* MISSION: two columns, grotesk heading + serif body */}
      <section id="c-mission" className="mx-auto grid max-w-6xl gap-10 px-5 py-28 sm:px-10 md:grid-cols-2 md:gap-20 md:py-36">
        <h2 data-reveal className="c-sans text-[clamp(2rem,3.6vw,3rem)] font-normal leading-[1.05] tracking-[-0.035em]">
          Some days are heavy, and you can&apos;t say why
        </h2>
        <div>
          <p data-reveal className="c-serif text-[clamp(1.3rem,1.8vw,1.6rem)] leading-[1.4]">{mission}</p>
          <ul data-reveal className="mt-10 divide-y divide-[#1e1d19]/15 border-y border-[#1e1d19]/15">
            {pillars.map((p, i) => (
              <li key={p.title} className="grid grid-cols-[3rem_1fr] gap-2 py-5">
                <span className="text-sm text-[#1e1d19]/50">0{i + 1}</span>
                <div>
                  <h3 className="text-[17px] font-medium tracking-[-0.01em]">{p.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#1e1d19]/70">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="flex min-h-[70svh] items-center justify-center px-5">
        <p className="c-statement c-sans max-w-3xl text-center text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.1] tracking-[-0.035em]">
          You don&apos;t have to carry it alone. The joy is in the little moments, and in the people you share them with.
        </p>
      </section>

      {/* QUOTE CARDS in the style of her Instagram posts */}
      <section className="c-quotes mx-auto max-w-6xl px-5 py-20 sm:px-10">
        <p data-reveal className="mb-10 text-center text-xs uppercase tracking-[0.3em] text-[#1e1d19]/60">From Adriana</p>
        <div className="grid gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q} className="c-quote flex aspect-square flex-col items-center justify-between bg-[#efe9dc] p-8 text-center shadow-[0_20px_50px_-30px_rgba(30,29,25,0.4)]">
              <span />
              <blockquote className="c-serif text-[clamp(1.5rem,2.2vw,1.9rem)] leading-[1.12]">{q}</blockquote>
              <figcaption className="text-[10px] uppercase tracking-[0.3em] text-[#1e1d19]/60">@withadrianacox</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-10 md:py-32">
        <h2 data-reveal className="c-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[1]">Where the joy comes from</h2>
        <p data-reveal className="mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-[#1e1d19]/75">{story}</p>
      </section>

      {/* FOUNDER */}
      <section id="c-founder" className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-10 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
        <div data-reveal className="c-portrait relative aspect-[2/3] overflow-hidden rounded-[4px]">
          <Image src="/media/adriana-portrait.jpg" alt="Adriana Cox smiling, seated on a wooden bench" fill sizes="(min-width: 768px) 45vw, 100vw" className="scale-110 object-cover object-top" />
        </div>
        <div>
          <p data-reveal className="text-xs uppercase tracking-[0.3em] text-[#1e1d19]/60">Founder</p>
          <h2 data-reveal className="c-serif mt-4 text-[clamp(3rem,6vw,5.2rem)] leading-[0.95]">Adriana Cox</h2>
          <p data-reveal className="mt-8 max-w-lg text-[17px] leading-relaxed text-[#1e1d19]/75">{bio}</p>
          <div data-reveal className="mt-10 flex flex-wrap gap-3 text-sm">
            <a href={SUBSTACK} target="_blank" rel="noreferrer" className="rounded-full bg-[#1e1d19] px-6 py-3 text-[#f6f3ec] transition-colors hover:bg-[#3a372f]">Read on Substack</a>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="rounded-full border border-[#1e1d19]/25 px-6 py-3 transition-colors hover:border-[#1e1d19]">@withadrianacox</a>
          </div>
        </div>
      </section>

      {/* JOIN */}
      <section className="flex flex-col items-center px-5 py-32 text-center md:py-44">
        <h2 data-reveal className="c-serif max-w-3xl text-[clamp(2.8rem,6.5vw,5.8rem)] leading-[0.98]">
          Save a seat in the <em>first circle</em>
        </h2>
        <div data-reveal className="mt-10 flex w-full justify-center"><EmailForm tone="stone" /></div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-[#1e1d19]/15 px-5 pt-8 text-xs text-[#1e1d19]/65 sm:px-10 md:flex-row md:justify-between">
        <p className="max-w-md leading-relaxed">{disclaimer}</p>
        <p>joycollective.org</p>
      </footer>
    </div>
  );
}
