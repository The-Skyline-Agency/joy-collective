"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import EmailForm from "./EmailForm";
import Switcher from "./Switcher";
import { bio, disclaimer, INSTAGRAM, mission, pillars, quote, story, SUBSTACK } from "./content";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const words = ["Seen", "Heard", "Held", "Joy"];
const strip = [
  { src: "/media/friends-sky.jpg", alt: "Two friends wrapped in a blanket, laughing under a blue sky", label: "A laugh with a friend" },
  { src: "/media/balance.jpg", alt: "A woman with hands pressed together by the sea", label: "A quiet minute" },
  { src: "/media/friends-park.jpg", alt: "Two women talking in a sunlit park", label: "Talking it through" },
  { src: "/media/friends-cuddle.jpg", alt: "Two friends cuddling and smiling in the sun", label: "Someone who gets it" },
];

export default function MockupB() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const title = SplitText.create(".b-title", { type: "words,chars", mask: "chars" });
        // Masks clip descenders (j, y, comma): pad them during the reveal, then drop the split entirely.
        gsap.set(title.masks, { paddingBottom: "0.2em", marginBottom: "-0.2em" });
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(".b-video", { scale: 1.15, duration: 2.4, ease: "power2.out" })
          .from(title.chars, { yPercent: 130, duration: 1.1, stagger: 0.025, onComplete: () => title.revert() }, 0.3)
          .from(".b-fade", { autoAlpha: 0, y: 20, duration: 0.9, stagger: 0.1 }, 0.9);

        // Hero text drifts up and fades as you leave the fold.
        gsap.to(".b-hero-inner", { yPercent: -25, autoAlpha: 0, ease: "none", scrollTrigger: { trigger: ".b-hero", start: "top top", end: "bottom top", scrub: true } });

        // Endless word band.
        gsap.to(".marquee-track", { xPercent: -50, duration: 28, ease: "none", repeat: -1 });

        // Mission lights up word by word.
        const m = SplitText.create(".b-mission", { type: "words" });
        gsap.fromTo(m.words, { opacity: 0.15 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ".b-mission-wrap", start: "top 70%", end: "bottom 55%", scrub: true } });

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, { autoAlpha: 0, y: 40, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
        });
      });

      // Pinned horizontal photo strip on wide screens only; it stacks on phones.
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const track = document.querySelector<HTMLElement>(".b-strip-track");
        if (!track) return;
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth + 48),
          ease: "none",
          scrollTrigger: { trigger: ".b-strip", pin: true, scrub: 1, end: () => "+=" + track.scrollWidth, invalidateOnRefresh: true },
        });
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);
      return () => window.removeEventListener("load", refresh);
    },
    { scope: root },
  );

  return (
    <div ref={root} className="bg-[#fbf7f9] pb-24">
      {/* HERO */}
      <header className="b-hero relative h-svh min-h-[620px] overflow-hidden bg-blue-light">
        <video className="b-video absolute inset-0 h-full w-full object-cover" src="/media/balance.mp4" poster="/media/balance.jpg" autoPlay muted loop playsInline aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-blue/55 via-ink/35 to-ink/65" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(20_24_40/0.4),transparent_65%)]" />

        <nav className="b-fade absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-5 text-white sm:px-10">
          <span className="font-heading text-lg font-semibold">the joy collective</span>
          <a href="#join-b" className="glass rounded-full px-5 py-2 text-sm">Join the list</a>
        </nav>

        <div className="b-hero-inner relative z-10 flex h-full flex-col items-center justify-center px-5 text-center text-white">
          <p className="b-fade mb-6 text-sm uppercase tracking-[0.2em] text-white/90">A circle for women · Launching Nov 30</p>
          <h1 className="b-title max-w-5xl text-[clamp(3rem,9vw,8.5rem)] font-normal leading-[0.95]">Choose joy, together.</h1>
          <p className="b-fade mt-8 max-w-xl text-base text-white/90 sm:text-lg">Small groups. Real conversations about the hard stuff. A place to feel seen and heard.</p>
          <div className="b-fade mt-10 flex w-full justify-center"><EmailForm /></div>
        </div>
      </header>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-ink/10 bg-pink py-5" aria-hidden>
        <div className="marquee-track flex w-max whitespace-nowrap font-heading text-[clamp(2rem,5vw,4rem)] leading-none">
          {[0, 1].map((k) => (
            <span key={k} className="flex">
              {Array.from({ length: 4 }).flatMap((_, r) =>
                words.map((w) => (
                  <span key={`${k}-${r}-${w}`} className="flex items-center px-6">
                    {w}
                    <span className="ml-12 inline-block h-3 w-3 rounded-full bg-blue" />
                  </span>
                )),
              )}
            </span>
          ))}
        </div>
      </div>

      {/* MISSION */}
      <section className="b-mission-wrap mx-auto max-w-6xl px-5 py-28 sm:px-10 md:py-40">
        <p className="mb-8 text-sm uppercase tracking-[0.2em] text-blue">Our mission</p>
        <p className="b-mission font-heading text-[clamp(1.9rem,4.2vw,3.6rem)] leading-[1.15]">{mission}</p>
        <div className="mt-20 grid gap-10 border-t border-ink/10 pt-10 md:grid-cols-3">
          {pillars.map((p, i) => (
            <div key={p.title} data-reveal>
              <span className="font-heading text-5xl text-[#b9709f]">0{i + 1}</span>
              <h3 className="mt-3 text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-75">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STRIP */}
      <section className="b-strip overflow-hidden py-10 md:flex md:h-svh md:items-center md:py-0">
        <div className="b-strip-track flex flex-col gap-6 px-5 md:w-max md:flex-row md:px-10">
          <div className="flex shrink-0 flex-col justify-center md:w-[34vw] md:pr-10">
            <p className="text-sm uppercase tracking-[0.2em] text-blue">Where the joy comes from</p>
            <h2 className="mt-5 text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.05]">Little moments, noticed and collected</h2>
            <p className="mt-6 max-w-md leading-relaxed text-ink-75">{story}</p>
          </div>
          {strip.map((s, i) => (
            <figure key={s.src} className={`relative shrink-0 overflow-hidden rounded-[28px] md:h-[70vh] ${i % 2 ? "md:mt-16 md:w-[30vw]" : "md:w-[40vw]"} aspect-[4/5] md:aspect-auto`}>
              <Image src={s.src} alt={s.alt} fill sizes="(min-width: 900px) 40vw, 100vw" className="object-cover" />
              <figcaption className="glass-dark absolute bottom-5 left-5 rounded-full px-4 py-1.5 text-sm text-white">{s.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FOUNDER */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-28 sm:px-10 md:grid-cols-2 md:py-36">
        <div data-reveal className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-full bg-mist">
          <Image src="/media/adriana.jpg" alt="Portrait of Adriana Cox" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
        </div>
        <div>
          <p data-reveal className="text-sm uppercase tracking-[0.2em] text-blue">Meet the founder</p>
          <h2 data-reveal className="mt-5 text-[clamp(2.4rem,4.4vw,3.8rem)] leading-[1.05]">Adriana Cox</h2>
          <p data-reveal className="mt-6 leading-relaxed text-ink-75">{bio}</p>
          <blockquote data-reveal className="mt-8 border-l-2 border-pink pl-5 font-heading text-xl leading-snug">&ldquo;{quote}&rdquo;</blockquote>
          <div data-reveal className="mt-8 flex gap-5 text-sm font-medium">
            <a href={SUBSTACK} target="_blank" rel="noreferrer" className="underline decoration-pink decoration-2 underline-offset-4 hover:text-blue">Substack</a>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="underline decoration-pink decoration-2 underline-offset-4 hover:text-blue">Instagram</a>
          </div>
        </div>
      </section>

      {/* JOIN */}
      <section id="join-b" className="mx-3 overflow-hidden rounded-[32px] bg-ink px-6 py-24 text-center text-white sm:mx-5 md:py-32">
        <h2 data-reveal className="mx-auto max-w-3xl text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[1.02]">Save a seat in the first circle</h2>
        <p data-reveal className="mx-auto mt-5 max-w-md text-white/75">We&apos;re opening our first small groups soon. Leave your email and we&apos;ll let you know.</p>
        <div data-reveal className="mt-10 flex justify-center"><EmailForm tone="dark" /></div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-4 px-5 pt-12 text-xs text-ink-75 sm:px-10 md:flex-row md:justify-between">
        <p className="max-w-md leading-relaxed">{disclaimer}</p>
        <p>joycollective.org</p>
      </footer>

      <Switcher current="b" />
    </div>
  );
}
