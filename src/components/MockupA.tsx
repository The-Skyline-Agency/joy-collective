"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import EmailForm from "./EmailForm";
import { bio, disclaimer, INSTAGRAM, mission, pillars, quote, story, SUBSTACK } from "./content";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`flex items-center gap-2 font-heading text-[17px] font-semibold ${light ? "text-white" : "text-ink"}`}>
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
        <circle cx="11" cy="11" r="5" fill="currentColor" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="10.25" y="0.5" width="1.5" height="3.5" rx="0.75" fill="currentColor" transform={`rotate(${i * 45} 11 11)`} />
        ))}
      </svg>
      the joy collective
    </span>
  );
}

export default function MockupA() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".hero-card", { clipPath: "inset(6% 6% 6% 6% round 48px)", scale: 1.04, duration: 1.4, ease: "expo.out" })
          .from(".hero-img", { scale: 1.2, duration: 2 }, 0)
          .from(".hero-fade", { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.08 }, 0.7);
        // autoSplit re-splits once fonts load and on resize, so line breaks stay correct.
        SplitText.create(".hero-title", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            // Masks clip descenders (j, y, comma): pad them during the reveal, then drop the split entirely.
            gsap.set(self.masks, { paddingBottom: "0.18em", marginBottom: "-0.18em" });
            return gsap.from(self.lines, { yPercent: 120, duration: 1, stagger: 0.12, delay: 0.5, ease: "power3.out", onComplete: () => self.revert() });
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, { autoAlpha: 0, y: 40, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: el.parentElement, scrub: true } });
        });

        gsap.from(".pillar", { autoAlpha: 0, y: 50, stagger: 0.12, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".pillars", start: "top 80%" } });

        const path = document.querySelector<SVGPathElement>(".swirl path");
        if (path) {
          const len = path.getTotalLength();
          gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".story", start: "top 80%", end: "bottom 60%", scrub: 1 } });
        }
      });
      // Images and fonts change layout after first paint.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);
      return () => window.removeEventListener("load", refresh);
    },
    { scope: root },
  );

  return (
    <div ref={root} className="pb-28">
      {/* HERO: edge to edge, content grouped in two anchored blocks */}
      <header className="hero-card relative bg-forest mx-2 mt-2 h-[calc(100svh-16px)] min-h-[720px] overflow-hidden rounded-[32px] sm:mx-3 sm:mt-3 sm:h-[calc(100svh-24px)]">
        {/* On phones the photo fills only the top of the card so the headline tab never covers the faces */}
        <div className="absolute inset-x-0 top-0 h-[62%] overflow-hidden sm:h-full">
          <Image src="/media/hero-friends.jpg" alt="Two friends wrapped in a shared blanket under a deep blue sky" fill priority sizes="100vw" className="hero-img object-cover object-[50%_88%] max-sm:object-[50%_75%]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-forest/90 via-forest/50 to-forest/30" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/35 to-transparent" />

        <nav className="hero-fade relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
          <Logo light />
          <ul className="hidden gap-10 text-sm text-white/90 md:flex">
            <li><a href="#mission" className="hover:text-white">Mission</a></li>
            <li><a href="#story" className="hover:text-white">Our story</a></li>
            <li><a href="#founder" className="hover:text-white">Founder</a></li>
          </ul>
          <a href="#join" className="rounded-full border border-white/70 px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-ink">Join the list</a>
        </nav>

        {/* Right: one info card, anchored to the bottom corner */}
        <aside className="hero-fade glass-dark absolute bottom-10 right-10 z-10 hidden w-[340px] rounded-3xl p-4 text-white lg:block">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-white">
            <Image src="/media/circle.webp" alt="A small group sitting in a circle, talking" fill sizes="340px" className="object-cover" />
          </div>
          <div className="px-1 pt-4">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-forest">Launching November 30</span>
            <p className="mt-3 text-[15px] font-medium">Small circles. Real conversations.</p>
            <ul className="mt-3 divide-y divide-white/30 text-sm text-white/90">
              <li className="flex justify-between py-2">Seen <span aria-hidden>→</span></li>
              <li className="flex justify-between py-2">Heard <span aria-hidden>→</span></li>
              <li className="flex justify-between py-2">Little moments of joy <span aria-hidden>→</span></li>
            </ul>
          </div>
        </aside>

        {/* Left: headline, intro and signup together in the notched tab */}
        <div className="notch z-10 w-[min(840px,94%)] pb-2 pr-6 pt-7 sm:pr-12 sm:pt-10">
          <h1 className="hero-title pl-1 text-[clamp(2.6rem,5.2vw,4.8rem)] font-normal leading-[1.0]">
            Little moments of joy, shared out loud
          </h1>
          <p className="hero-fade mt-5 max-w-lg pl-1 text-ink-75 sm:text-lg">
            Small groups of women having real conversations about the hard stuff.
          </p>
          <div className="hero-fade mt-6 pl-1"><EmailForm tone="dark" /></div>
        </div>
      </header>

      <div className="mx-auto max-w-[1320px] px-3 sm:px-5">

      {/* MISSION */}
      <section id="mission" className="grid gap-10 py-24 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:py-32">
        <div data-reveal className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
          <Image data-parallax src="/media/friends-cuddle.jpg" alt="Two friends cuddling and smiling in the sun" fill sizes="(min-width: 768px) 45vw, 100vw" className="scale-110 object-cover" />
          <span className="glass-dark absolute left-5 top-5 rounded-full px-4 py-1.5 text-xs text-white">You are not the only one</span>
        </div>
        <div className="flex flex-col justify-center">
          <span data-reveal className="w-fit rounded-full bg-ink px-4 py-1.5 text-xs text-white"># Our mission</span>
          <h2 data-reveal className="mt-6 text-[clamp(2.2rem,4.4vw,3.5rem)] leading-[1.08]">You deserve to be seen and heard</h2>
          <p data-reveal className="mt-6 max-w-xl text-ink-75 leading-relaxed">{mission}</p>
          <div className="pillars mt-10 grid gap-4 sm:grid-cols-3">
            {pillars.map((p, i) => (
              <div key={p.title} className={`pillar rounded-2xl p-5 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.12)] ${i === 0 ? "bg-forest text-white" : "bg-white"}`}>
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${i === 0 ? "bg-white/20" : "bg-mist"}`}>0{i + 1}</span>
                <h3 className="mt-6 text-[15px] font-semibold">{p.title}</h3>
                <p className={`mt-2 text-xs leading-relaxed ${i === 0 ? "text-white/85" : "text-ink-75"}`}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="story relative overflow-hidden rounded-[32px] bg-cream px-6 py-20 sm:px-12 md:py-28">
        <svg className="swirl pointer-events-none absolute -left-10 top-6 w-[110%] md:w-[70%]" viewBox="0 0 800 300" fill="none" aria-hidden>
          <path d="M-20 220 C 120 120, 260 60, 360 110 S 420 260, 330 250 S 300 120, 460 90 S 700 120, 840 40" stroke="var(--color-sage)" strokeWidth="36" strokeLinecap="round" />
        </svg>
        <div className="relative grid items-center gap-12 md:grid-cols-2">
          <div>
            <span data-reveal className="w-fit rounded-full bg-ink px-4 py-1.5 text-xs text-white"># Where the joy comes from</span>
            <h2 data-reveal className="mt-6 text-[clamp(2.2rem,4.4vw,3.5rem)] leading-[1.08]">Small things that add up to a way out</h2>
            <p data-reveal className="mt-6 max-w-lg leading-relaxed text-ink-75">{story}</p>
          </div>
          <div data-reveal className="rounded-[28px] bg-white p-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px]">
              <Image src="/media/hands.webp" alt="Two hands reaching toward each other" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
            </div>
            <ul className="divide-y divide-ink/10 px-3 pt-2 text-[15px] font-medium">
              <li className="flex justify-between py-3">A laugh with a friend <span aria-hidden>⟶</span></li>
              <li className="flex justify-between py-3">Sun on a walk <span aria-hidden>⟶</span></li>
              <li className="flex justify-between py-3">A conversation that didn&apos;t need to be perfect <span aria-hidden>⟶</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section id="founder" className="grid items-center gap-10 py-24 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:py-32">
        <div data-reveal className="relative aspect-square overflow-hidden rounded-[28px] bg-mist">
          <Image data-parallax src="/media/adriana.jpg" alt="Portrait of Adriana Cox" fill sizes="(min-width: 768px) 40vw, 100vw" className="scale-110 object-cover" />
        </div>
        <div>
          <span data-reveal className="w-fit rounded-full bg-ink px-4 py-1.5 text-xs text-white"># Meet the founder</span>
          <blockquote data-reveal className="mt-6 font-heading text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.15]">&ldquo;{quote}&rdquo;</blockquote>
          <p data-reveal className="mt-6 max-w-xl leading-relaxed text-ink-75">{bio}</p>
          <div data-reveal className="mt-8 flex flex-wrap gap-3">
            <a href={SUBSTACK} target="_blank" rel="noreferrer" className="rounded-full bg-ink px-6 py-3 text-sm text-white transition-colors hover:bg-forest">Read her Substack <span aria-hidden>⟶</span></a>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="rounded-full border border-ink/20 px-6 py-3 text-sm transition-colors hover:border-ink">Instagram</a>
          </div>
        </div>
      </section>

      {/* JOIN */}
      <section id="join" data-reveal className="relative overflow-hidden rounded-[32px] px-6 py-24 text-white sm:px-12 md:py-32">
        <video className="absolute inset-0 h-full w-full object-cover" src="/media/clouds.mp4" poster="/media/clouds.jpg" autoPlay muted loop playsInline aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/90 to-forest/40" />
        <div className="relative max-w-2xl">
          <h2 className="text-[clamp(2.4rem,5vw,4rem)] leading-[1.04]">Be the first to know when circles open</h2>
          <p className="mt-5 max-w-lg text-white/90">We&apos;re gathering our first small groups now. Leave your email and we&apos;ll be in touch.</p>
          <div className="mt-8"><EmailForm /></div>
        </div>
      </section>

      <footer className="flex flex-col gap-6 pt-14 text-sm text-ink-75 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-md text-xs leading-relaxed">{disclaimer}</p>
        </div>
        <p className="text-xs">joycollective.org</p>
      </footer>

      </div>
    </div>
  );
}
