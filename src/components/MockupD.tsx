"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import localFont from "next/font/local";
import { Geist_Mono, Poppins } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import EmailForm from "./EmailForm";
import CurvedLoop from "./CurvedLoop";
import { disclaimer, INSTAGRAM, letter, pillars, SUBSTACK } from "./content";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, Draggable, InertiaPlugin, CustomEase);
// Eases from the reference: "osmo" for loader and reveals, "radial" for the card wheel.
CustomEase.create("osmo", "M0,0 C0.625,0.05 0,1 1,1");
CustomEase.create("radial", "0.25, 0.1, 0, 1");

// Poppins and Geist Mono come from Google Fonts. (General Sans files stay in app/fonts in case we switch back.)
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-poppins" });
const geistMono = Geist_Mono({ subsets: ["latin"], weight: "400", variable: "--font-gm" });
// Headings: Times New Roman MT Condensed, the face on Adriana's quote posts (converted to WOFF2).
// Monotype font: confirm the web licence before launch.
const timesCondensed = localFont({ src: "../app/fonts/TimesNewRomanMTCondensed.woff2", weight: "400", variable: "--font-serif" });

// Draft copy for Adriana to edit. Structure follows the reference, words are ours.
const P = {
  alone: { src: "/media/adriana-wall.jpg", alt: "Adriana Cox in a white shirt against a soft grey wall" },
  social: { src: "/media/d/d-social.jpg", alt: "Two friends arm in arm, laughing under a blue sky" },
};

// Free Magnific stock (License = Free); asset pages are listed in public/media/d/SOURCES.md.
const cards = [
  { src: "/media/d/d-card-laugh.jpg", title: "A laugh with a friend" },
  { src: "/media/d/d-card-walk.jpg", title: "Sun on a long walk" },
  { src: "/media/d/d-card-coffee.jpg", title: "Coffee with someone who gets it" },
  { src: "/media/d/d-card-journal.jpg", title: "Writing it down" },
  { src: "/media/d/d-card-call.jpg", title: "Calling her back" },
  { src: "/media/d/d-card-hug.jpg", title: "A hug that lasts" },
  { src: "/media/d/d-card-table.jpg", title: "A table that listens" },
  { src: "/media/d/d-card-sun.jpg", title: "Eyes closed in the sun" },
];

const problemWords = ["call her back", "ask for help", "say how you feel", "rest"];

const steps = [
  { title: "Join the list", body: "Leave your email and we'll write when the first circles open.", src: "/media/friends-park.jpg" },
  { title: "Find your circle", body: "A handful of women around a table. Close enough to talk, not an audience.", src: "/media/d/d-circle.jpg" },
  { title: "Show up as you are", body: "Nobody performs and nobody fixes. You leave a little lighter.", src: "/media/friends-cuddle.jpg" },
];

const notifs = ["Maya saved you a seat", "Lena shared a little joy today", "Your circle starts soon", "Priya just joined the circle"];

const features = [
  { ...pillars[0], src: "/media/d/d-card-table.jpg", pos: "50% 60%" },
  { ...pillars[1], src: "/media/friends-park.jpg", pos: "55% 30%" },
  { ...pillars[2], src: "/media/friends-cuddle.jpg", pos: "50% 30%" },
];

const LOADER_KEY = "jc:loader-seen";

// Leaf helpers for the small sprout icon: each leaf base sits just off the stem.
const LEAF_GAP = 8;
const leafPath = (len: number, w: number) => `M0 0 C ${w} ${-len * 0.3}, ${w} ${-len * 0.75}, 0 ${-len} C ${-w} ${-len * 0.75}, ${-w} ${-len * 0.3}, 0 0 Z`;
const leafAt = (x: number, y: number, rot: number, gap = LEAF_GAP) => {
  const r = (rot * Math.PI) / 180;
  return `translate(${(x + Math.sin(r) * gap).toFixed(2)} ${(y - Math.cos(r) * gap).toFixed(2)}) rotate(${rot})`;
};
// Logo artwork from Fernanda: the wordmark in the nav, the icon on its own above the sign-up.
function Wordmark({ horizontal = false }: { horizontal?: boolean }) {
  return horizontal ? (
    <Image className="logo is--horizontal" src="/media/d/logo-joycollective.svg" alt="The Joy Collective" width={1433} height={217} priority />
  ) : (
    <Image className="logo is--stacked" src="/media/d/icon-joycollective.svg" alt="The Joy Collective" width={782} height={746} />
  );
}

// Small sprout for icon spots (notifications, pop-up). Inherits the text color.
function SunMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <path transform={leafAt(26, 24, -55, 4)} d={leafPath(15, 5)} fill="currentColor" opacity=".7" />
      <path transform={leafAt(27, 15, 58, 4)} d={leafPath(13, 4.5)} fill="currentColor" opacity=".5" />
      <path transform={leafAt(27, 6, 4, 4)} d={leafPath(11, 4)} fill="currentColor" />
      <path d="M24 44 C 24 34, 25 26, 27 18 C 28 13, 28 9, 27 5" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" />
    </svg>
  );
}

// Button with a label that rolls up on hover and a magnetic pull on desktop.
function Btn({
  children,
  variant = "primary",
  size = "lg",
  href,
  onClick,
  soon,
}: {
  children: string;
  variant?: "primary" | "secondary";
  size?: "lg" | "md";
  href?: string;
  onClick?: () => void;
  soon?: string;
}) {
  const inner = (
    <>
      <div className="btn__fill" />
      <div className="btn__content" data-magnetic-inner-target>
        <div className="btn__text">
          <p className="btn__text-p">{children}</p>
          <p className="btn__text-p is--duplicate" aria-hidden>
            {children}
          </p>
        </div>
        {soon && <span className="visually-hidden">, {soon.toLowerCase()}</span>}
      </div>
    </>
  );
  const magnetic = soon ? {} : { "data-magnetic-strength": size === "lg" ? 50 : 25, "data-magnetic-strength-inner": size === "lg" ? 25 : 12 };
  return (
    <div className={`btn is--${variant} is--${size} ${soon ? "is--soon" : ""} ${variant === "primary" ? "on-dark" : ""}`}>
      {href ? (
        <a className="btn__click" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" {...magnetic}>
          {inner}
        </a>
      ) : (
        <button
          className="btn__click"
          type="button"
          onClick={soon ? undefined : onClick}
          aria-disabled={soon ? true : undefined}
          data-cursor-hover={soon ? true : undefined}
          data-cursor-text={soon}
          {...magnetic}
        >
          {inner}
        </button>
      )}
      {soon && (
        <span className="btn__tip on-dark" aria-hidden>
          {soon}
        </span>
      )}
    </div>
  );
}

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function MockupD() {
  const root = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [modal, setModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const openModal = useCallback(() => setModal(true), []);

  // Reduced motion: hold the hero video on its poster frame.
  useEffect(() => {
    if (reduced()) root.current?.querySelector<HTMLVideoElement>(".hero__video")?.pause();
  }, []);

  // Smooth scroll on the GSAP ticker, like the reference. Off for touch and reduced motion.
  useEffect(() => {
    if (reduced() || window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
    const lenis = new Lenis({ anchors: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!modal) return;
    lenisRef.current?.stop();
    // Wait a frame: the card is still visibility:hidden in the commit that opens it.
    const f = requestAnimationFrame(() => cardRef.current?.querySelector("input")?.focus());
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setModal(false);
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(f);
      window.removeEventListener("keydown", onKey);
      lenisRef.current?.start();
    };
  }, [modal]);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current!;
      const q = <T extends Element = HTMLElement>(s: string) => el.querySelector<T>(s)!;
      const qa = <T extends Element = HTMLElement>(s: string) => Array.from(el.querySelectorAll<T>(s));
      const cleanups: (() => void)[] = [];
      const noMotion = reduced();

      // ---------- Nav: past 100px the bar drops its links and narrows (styles in d.css) ----------
      ScrollTrigger.create({ start: 100, end: "max", toggleClass: { targets: ".gt .nav", className: "is--scrolled" } });

      // ---------- Loader: stacked cards spring in, fly away, page slides up ----------
      const loader = q(".loader");
      let seen = false;
      try {
        seen = sessionStorage.getItem(LOADER_KEY) === "1";
      } catch {}
      if (noMotion || seen) loader.classList.add("is--skipped");
      else {
        const cardsL = qa(".loader__card");
        const rot = [-10, 10, -15, 10, 20];
        const xp = [-5, 7.5, 10, 5, -10];
        const stack = (i: number, n: number) => ({ scale: 1 - (n - 1 - i) * 0.1, yPercent: (n - 1 - i) * -7.5 });
        const by = (k: "scale" | "yPercent", n: number) => (i: number) => stack(i, n)[k];
        const below = (c: HTMLElement) => {
          const a = loader.getBoundingClientRect();
          const b = c.getBoundingClientRect();
          return a.bottom - b.top + b.height;
        };
        const tl = gsap.timeline({
          onComplete: () => {
            loader.classList.add("is--skipped");
            try {
              sessionStorage.setItem(LOADER_KEY, "1");
            } catch {}
          },
        });
        tl.fromTo(".loader__list", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.15);
        tl.fromTo(cardsL, { rotate: 0.001, scale: 0.5, yPercent: 0 }, { rotate: 0.001, scale: by("scale", cardsL.length), yPercent: by("yPercent", cardsL.length), stagger: -0.05, duration: 1.5, ease: "elastic.out(1,0.7)" }, "<");
        const step = 0.75 / Math.max(cardsL.length - 1, 1);
        cardsL
          .slice()
          .reverse()
          .forEach((c, n) => {
            const under = cardsL.slice(0, cardsL.indexOf(c));
            const at = 1.05 + n * step;
            if (under.length) tl.to(under, { scale: by("scale", under.length), yPercent: by("yPercent", under.length), duration: 1, ease: "sine.inOut", overwrite: "auto" }, at);
            tl.to(c, { y: () => below(c), xPercent: xp[n % xp.length], rotate: rot[n % rot.length], duration: 0.8, ease: "power4.in", overwrite: "auto" }, at);
          });
        tl.to(".loader__bg", { rotate: 0.001, yPercent: 100, duration: 1.5, ease: "osmo" }, "-=0.6");
        tl.from(".hero", { rotate: 0.001, yPercent: -25, scale: 1.1, duration: 1.5, ease: "osmo" }, "<");
        const failsafe = window.setTimeout(() => loader.classList.add("is--skipped"), 6000);
        cleanups.push(() => window.clearTimeout(failsafe));
      }

      // ---------- Radial card wheel: drag with inertia, snap to 18deg, arrows ----------
      const initRadial = contextSafe!(() => {
        const sl = q(".radial");
        const collection = q(".radial__collection");
        const rlist = q(".radial__list");
        const items = qa(".radial__item");
        const N = items.length;
        const p = Math.abs(parseFloat(getComputedStyle(sl).getPropertyValue("--slider-rotate"))) || 18;
        gsap.set(items, { rotation: 0 });
        const w = items[0].offsetWidth;
        const h = items[0].offsetHeight;
        const radius = parseFloat(getComputedStyle(items[0]).transformOrigin.split(" ")[1]) || h * 3.75;
        const b = Math.max(0, radius - h / 2);
        const x = b + Math.max(w, h) * 0.525;
        rlist.style.height = h + "px";
        const sr = sl.getBoundingClientRect();
        const cr = collection.getBoundingClientRect();
        const lr = rlist.getBoundingClientRect();
        const wrap = document.createElement("div");
        Object.assign(wrap.style, { position: "absolute", left: sr.left - cr.left + "px", top: sr.top - cr.top + "px", width: sr.width + "px", height: sr.height + "px", overflow: "hidden", pointerEvents: "none" });
        const proxy = document.createElement("div");
        Object.assign(proxy.style, { position: "absolute", width: x * 2 + "px", height: x * 2 + "px", left: lr.left + lr.width / 2 - sr.left + "px", top: lr.top - sr.top + radius - x + "px", transform: "translateX(-50%)", borderRadius: "50%", pointerEvents: "auto", opacity: "0", touchAction: "pan-y" });
        wrap.appendChild(proxy);
        collection.appendChild(wrap);
        // Like the reference, only slots whose card overlaps the section are shown; the rest of the
        // circle would otherwise swing round below the pivot and hang over the next sections.
        const fits = (n: number) => {
          const a = (n * p * Math.PI) / 180;
          const cx = Math.sin(a) * b;
          const cy = radius - Math.cos(a) * b;
          const hw = (Math.abs(Math.cos(a)) * w) / 2 + (Math.abs(Math.sin(a)) * h) / 2;
          const hh = (Math.abs(Math.sin(a)) * w) / 2 + (Math.abs(Math.cos(a)) * h) / 2;
          const ox = lr.left + lr.width / 2;
          return cx + hw >= sr.left - ox && cx - hw <= sr.right - ox && cy + hh >= sr.top - lr.top && cy - hh <= sr.bottom - lr.top;
        };
        let reach = 0;
        while (reach < N / 2 && fits(reach + 1)) reach++;
        const setters = items.map((it) => gsap.quickSetter(it, "rotation", "deg"));
        gsap.set(proxy, { rotation: 0 });
        const pos = () => -(gsap.getProperty(proxy, "rotation") as number) / p;
        const offset = (i: number, t: number) => i - (t - Math.round((t - i) / N) * N);
        const update = () => {
          const t = pos();
          items.forEach((it, i) => {
            const o = offset(i, t);
            setters[i](o * p);
            it.style.visibility = Math.abs(o) < reach + 1 ? "" : "hidden";
          });
        };
        const rot = () => gsap.getProperty(proxy, "rotation") as number;
        const setDrag = (s: string) => sl.setAttribute("data-drag", s);
        // dir: 1 turns the wheel forward (cards travel right to left), -1 backward.
        let dir = 1;
        let pressRot = 0;
        const drag = Draggable.create(proxy, {
          type: "rotation",
          trigger: [proxy, ...items],
          allowEventDefault: true,
          inertia: true,
          throwResistance: 2000,
          dragResistance: 0.05,
          maxDuration: 1,
          minDuration: 0.5,
          edgeResistance: 0.75,
          overshootTolerance: 0,
          snap: (v: number) => Math.round(v / p) * p,
          // The drift moves the proxy behind Draggable's back, so resync before each press.
          onPressInit() {
            this.update();
          },
          onDrag: update,
          onThrowUpdate: update,
          onThrowComplete: () => (setDrag("grab"), update()),
          onPress: () => {
            pressRot = rot();
            setDrag("grabbing");
          },
          onDragStart: () => setDrag("grabbing"),
          onRelease: () => {
            setDrag("grab");
            // Keep drifting the way the user last pushed it.
            if (Math.abs(rot() - pressRot) > 1) dir = rot() < pressRot ? 1 : -1;
          },
        })[0];

        // Trackpad swipe: horizontal wheel turns the wheel one card per card-width of travel.
        const onWheel = (e: WheelEvent) => {
          if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
          e.preventDefault(); // also stops the browser's swipe-to-go-back
          const px = e.deltaMode === 1 ? e.deltaX * 16 : e.deltaX;
          gsap.killTweensOf(proxy);
          gsap.set(proxy, { rotation: rot() - (px / w) * p });
          dir = px > 0 ? 1 : -1;
          update();
        };
        sl.addEventListener("wheel", onWheel, { passive: false });

        // Auto drift, coupled to page scroll: Lenis velocity (px per frame) speeds it up and
        // its sign sets the direction. Without Lenis (touch), the scrollY delta stands in.
        const base = p / 5; // one card every 5s
        let vel = 0;
        let lastY = window.scrollY;
        const tick = (_t: number, dt: number) => {
          // Cap: keeps real speed through stutters, but no jump after returning to a background tab.
          const sec = Math.min(dt, 250) / 1000;
          const y = window.scrollY;
          const sv = lenisRef.current ? lenisRef.current.velocity : y - lastY;
          lastY = y;
          if (Math.abs(sv) > 0.5) dir = sv > 0 ? 1 : -1;
          const busy = drag.isPressed || !!drag.tween?.isActive() || gsap.isTweening(proxy);
          const target = busy ? 0 : dir * base + gsap.utils.clamp(-60, 60, sv * 0.9);
          vel += (target - vel) * Math.min(1, sec * 4); // ease toward the target speed
          if (busy || Math.abs(vel) < 0.001) return;
          gsap.set(proxy, { rotation: rot() - vel * sec });
          update();
        };
        if (!noMotion) gsap.ticker.add(tick);

        // Touch: a mostly vertical swipe scrolls the page instead of turning the wheel.
        const gate = new AbortController();
        if (window.matchMedia("(any-pointer: coarse)").matches) {
          let sx = 0, sy = 0, decided = false, off = false;
          const restore = () => {
            if (!off) return;
            off = false;
            drag.enable();
            setDrag("grab");
          };
          const start = (e: TouchEvent) => {
            const t = e.touches[0];
            if (!t) return;
            restore();
            sx = t.clientX;
            sy = t.clientY;
            decided = false;
          };
          const move = (e: TouchEvent) => {
            if (decided) return;
            const t = e.touches[0];
            if (!t) return;
            const dx = Math.abs(t.clientX - sx), dy = Math.abs(t.clientY - sy);
            if (dx < 8 && dy < 8) return;
            decided = true;
            if (dx <= dy * 2) {
              off = true;
              drag.disable();
            }
          };
          const o = { passive: true, signal: gate.signal };
          [proxy, ...items].forEach((n) => {
            n.addEventListener("touchstart", start, o);
            n.addEventListener("touchmove", move, o);
            n.addEventListener("touchend", restore, o);
            n.addEventListener("touchcancel", restore, o);
          });
        }
        update();
        return () => {
          gsap.ticker.remove(tick);
          sl.removeEventListener("wheel", onWheel);
          gate.abort();
          drag.kill();
          gsap.killTweensOf(proxy);
          wrap.remove();
        };
      });

      // ---------- Steps: autoplaying tabs with a progress line and a masked photo reveal ----------
      const initSteps = contextSafe!(() => {
        const items = qa(".steps__item");
        const visuals = qa(".steps__visual");
        const autoplay = !noMotion;
        // Phones: every step stays open and the photo just rotates every 3s, with no progress line.
        const compact = window.matchMedia("(max-width: 767px)").matches;
        const ms = compact ? 3000 : 7000;
        let current: HTMLElement | null = null;
        let currentV: HTMLElement | null = null;
        let busy = false;
        let progress: gsap.core.Tween | null = null;
        let timer: number | undefined;
        const runProgress = (i: number) => {
          progress?.kill();
          if (compact) {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => void (!busy && show((i + 1) % items.length)), ms - 900); // 3s per photo including the 0.9s reveal
            return;
          }
          const bar = items[i].querySelector(".steps__progress");
          gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
          progress = gsap.to(bar, { scaleX: 1, duration: ms / 1000, ease: "power1.inOut", onComplete: () => !busy && show((i + 1) % items.length) });
        };
        const show = (i: number) => {
          if (busy || items[i] === current) return;
          busy = true;
          progress?.kill();
          window.clearTimeout(timer);
          const prev = current;
          const prevV = currentV;
          const item = items[i];
          const vis = visuals[i];
          items.forEach((it, n) => {
            it.setAttribute("aria-selected", String(n === i));
            it.tabIndex = n === i ? 0 : -1;
          });
          visuals.forEach((v, n) => (n === i ? v.removeAttribute("aria-hidden") : v.setAttribute("aria-hidden", "true")));
          const dur = noMotion ? 0 : 0.9;
          gsap.set(vis, { autoAlpha: 1, zIndex: 1 });
          if (prevV) gsap.set(prevV, { zIndex: 0 });
          const tl = gsap.timeline({
            defaults: { duration: 0.65, ease: "power3" },
            onComplete: () => {
              current = item;
              currentV = vis;
              busy = false;
              if (autoplay) runProgress(i);
            },
          });
          if (prev) {
            prev.classList.remove("active");
            prevV?.classList.remove("active");
            const pb = prev.querySelector(".steps__progress");
            tl.set(pb, { transformOrigin: "right center" }).to(pb, { scaleX: 0, duration: 0.3 }, 0).to(prev.querySelector(".steps__detail"), { height: 0 }, 0);
          }
          item.classList.add("active");
          vis.classList.add("active");
          tl.fromTo(vis, { "--reveal": "-16%" }, { "--reveal": "100%", duration: dur, ease: "power2.inOut" }, 0)
            .fromTo(vis.querySelector("img"), { filter: "blur(6px)" }, { filter: "blur(0px)", duration: dur, ease: "power2.out", clearProps: "filter" }, 0)
            .fromTo(item.querySelector(".steps__detail"), { height: 0 }, { height: "auto" }, 0)
            .set(item.querySelector(".steps__progress"), { scaleX: 0, transformOrigin: "left center" }, 0);
          if (prevV) tl.set(prevV, { autoAlpha: 0 });
        };
        // Reserve room for the tallest detail so the column never jumps.
        const stepsList = q(".steps__list");
        const details = qa(".steps__detail");
        stepsList.style.minHeight = "";
        if (!compact) {
        const tallest = Math.max(...details.map((d) => d.scrollHeight));
        const open = details.reduce((s, d) => s + d.offsetHeight, 0);
        stepsList.style.minHeight = stepsList.offsetHeight - open + tallest + "px";
        }
        const clicks = items.map((it, i) => {
          const fn = () => it !== current && show(i);
          it.addEventListener("click", fn);
          return () => it.removeEventListener("click", fn);
        });
        ScrollTrigger.create({ trigger: ".steps", start: "top 90%", once: true, onEnter: () => show(0) });
        return () => {
          clicks.forEach((c) => c());
          progress?.kill();
          window.clearTimeout(timer);
        };
      });

      // ---------- Swirls: hand-drawn lines that draw themselves over the photo above and behind the section text as you scroll (from Mockup A) ----------
      if (!noMotion) {
        document.querySelectorAll<SVGPathElement>(".gt .swirl path").forEach((path) => {
          const len = path.getTotalLength();
          // data-draw="reverse" reveals the line from its far end, so it reads right to left.
          const from = path.closest("[data-draw='reverse']") ? -len : len;
          gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: from }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: path.closest("section"), start: "top 95%", end: "top 25%", scrub: 1 } });
        });
      }

      // ---------- Bento cards rise in one after another; the photo chip follows ----------
      if (!noMotion) {
        gsap.from(qa(".bento__card"), { y: 60, autoAlpha: 0, duration: 1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ".gt .bento", start: "top 85%", once: true } });
        gsap.from(qa(".bento__chip"), { y: 30, scale: 0.92, autoAlpha: 0, duration: 0.9, delay: 0.45, ease: "back.out(1.6)", scrollTrigger: { trigger: ".gt .bento", start: "top 85%", once: true } });
        gsap.from(qa(".bento__face"), { x: -12, autoAlpha: 0, duration: 0.6, stagger: 0.06, delay: 0.5, ease: "power2.out", scrollTrigger: { trigger: ".gt .bento", start: "top 85%", once: true } });
      }

      // ---------- Founder note: lines rise in as you read; the portrait drifts slowly ----------
      if (!noMotion) {
        qa("[data-letter-reveal]").forEach((n) => gsap.from(n, { y: 28, autoAlpha: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: n, start: "top 88%", once: true } }));
        // No drift on phones: the portrait sits flush to its top edge there (see d.css).
        if (!window.matchMedia("(max-width: 767px)").matches) gsap.fromTo(".gt .letter__photo img", { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: ".gt .letter", start: "top bottom", end: "bottom top", scrub: true } });
      }

      // ---------- Closing logo: the stacked logo rises in above the sign-up ----------
      if (!noMotion) {
        gsap.from(".gt .closing__logo", { y: 40, autoAlpha: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".gt .closing__logo", start: "top 90%", once: true } });
      }

      // ---------- Notification stack: top card lifts away, the rest move up, a new one fades in ----------
      const initNotifs = contextSafe!(() => {
        const stack = q(".social__stack");
        const ns = qa(".notif");
        const slots = [
          { left: 8, top: 0, scale: 1 },
          { left: 30, top: 38.7, scale: 333 / 377 },
          { left: 65, top: 76, scale: 263 / 377 },
        ];
        const D = 0.55;
        const em = () => parseFloat(getComputedStyle(stack).fontSize) / 16;
        const at = (s: number, k: number) => ({ left: slots[s].left * k, top: slots[s].top * k, scale: slots[s].scale });
        let order = ns.map((_, i) => (i < slots.length ? i : -1));
        const k0 = em();
        ns.forEach((n, i) => {
          const s = order[i];
          if (s === -1) {
            gsap.set(n, { ...at(slots.length - 1, k0), autoAlpha: 0, zIndex: 17 });
            n.dataset.slot = String(slots.length - 1);
          } else {
            gsap.set(n, { ...at(s, k0), zIndex: 20 - s, autoAlpha: 1 });
            n.dataset.slot = String(s);
          }
        });
        if (noMotion) return () => {};
        let visible = false;
        let wait: gsap.core.Tween | undefined;
        let running: gsap.core.Timeline | undefined;
        const schedule = () => {
          wait?.kill();
          wait = visible ? gsap.delayedCall(3.4, cycle) : undefined;
        };
        const cycle = () => {
          if (!visible) return;
          const k = em();
          const top = ns[order.indexOf(0)];
          const incoming = ns[order.indexOf(-1)];
          const last = slots.length - 1;
          running = gsap.timeline({
            onComplete: () => {
              order = order.map((s) => (s === 0 ? -1 : s === -1 ? last : s - 1));
              running = undefined;
              schedule();
            },
          });
          running.to(top, { y: -34 * k, scale: 1.073, xPercent: -3.65, yPercent: -3.65, autoAlpha: 0, duration: D, ease: "power2.out" }, 0);
          order.forEach((s, i) => {
            if (s <= 0) return;
            const to = s - 1;
            running!.to(ns[i], { ...at(to, k), duration: D, ease: "power3.out", onStart: () => { ns[i].dataset.slot = String(to); gsap.set(ns[i], { zIndex: 20 - to }); } }, 0);
          });
          running.fromTo(incoming, { autoAlpha: 0, scale: slots[last].scale * 0.86 }, { autoAlpha: 1, scale: slots[last].scale, duration: D, ease: "power2.out", onStart: () => { gsap.set(incoming, { left: slots[last].left * k, top: slots[last].top * k, zIndex: 20 - last }); incoming.dataset.slot = String(last); } }, 0);
          running.call(() => {
            gsap.set(top, { y: 0, xPercent: 0, yPercent: 0, zIndex: 17, ...at(last, em()) });
            top.dataset.slot = String(last);
          });
        };
        const io = new IntersectionObserver(([e]) => {
          if (visible === e.isIntersecting) return;
          visible = e.isIntersecting;
          if (visible) {
            if (running) running.resume();
            else schedule();
          } else {
            wait?.kill();
            wait = undefined;
            running?.pause();
          }
        }, { rootMargin: "200px 0px" });
        io.observe(stack);
        return () => {
          io.disconnect();
          wait?.kill();
          running?.kill();
        };
      });

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hero photo drifts down slower than the page.
        mm.add("(min-width: 768px)", () => {
          gsap.fromTo(".hero__media", { yPercent: 0 }, { yPercent: 40, ease: "none", scrollTrigger: { trigger: ".hero", start: "clamp(top top)", end: "clamp(bottom top)", scrub: true } });
        });
        gsap.fromTo(".social__media", { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".social__frame", start: "top bottom", end: "bottom top", scrub: true } });

        // Rotating accent word: the box eases to each word's width while words roll up.
        const words = qa(".rot__word");
        const rotInner = q(".rot__inner");
        // Width in em so it scales with the fluid type; measured only once General Sans has loaded.
        const widthOf = (w: HTMLElement) => w.offsetWidth / parseFloat(getComputedStyle(rotInner).fontSize) + "em";
        gsap.set(words, { yPercent: 150, autoAlpha: 0 });
        gsap.set(words[0], { yPercent: 0, autoAlpha: 1 });
        let r = 0;
        let call: gsap.core.Tween | undefined;
        let live = true;
        document.fonts.ready.then(() => {
          if (!live) return;
          rotInner.style.width = widthOf(words[0]);
          call = gsap.delayedCall(2.5, roll);
        });
        const roll = () => {
          const i = (r + 1) % words.length;
          const out = words[r];
          const inn = words[i];
          gsap.to(rotInner, { width: widthOf(inn), duration: 0.75, ease: "power4.inOut" });
          gsap.to(out, { yPercent: -150, duration: 0.6, ease: "power4.inOut", onComplete: () => void gsap.set(out, { autoAlpha: 0 }) });
          gsap.set(inn, { autoAlpha: 1 });
          gsap.fromTo(inn, { yPercent: 150 }, { yPercent: 0, duration: 0.75, ease: "power4.inOut" });
          r = i;
          call = gsap.delayedCall(2.5, roll);
        };

        // Feature heading: lines rise out of a mask. Feature photos slide in, text follows.
        SplitText.create(".features [data-split]", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "split-line",
          onSplit: (self) => gsap.from(self.lines, { yPercent: 110, duration: 0.8, stagger: 0.08, ease: "expo.out", scrollTrigger: { trigger: self.elements[0], start: "clamp(top 80%)", once: true } }),
        });


        // Cursor label for "coming soon" buttons.
        const cursor = q(".cursor");
        const label = q(".cursor__text");
        let mx = 0, my = 0, moved = false;
        let last: Element | null | undefined = null;
        const qx = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3.out" });
        const qy = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3.out" });
        const check = () => {
          const hit = document.elementFromPoint(mx, my)?.closest("[data-cursor-hover]");
          const edge = cursor.getBoundingClientRect().right >= window.innerWidth;
          cursor.setAttribute("data-cursor", hit ? (edge ? "active-edge" : "active") : "");
          if (hit !== last) {
            const t = hit?.getAttribute("data-cursor-text");
            if (t) label.textContent = t;
            last = hit;
          }
        };
        const onMove = (e: MouseEvent) => {
          mx = e.clientX;
          my = e.clientY;
          moved = true;
          qx(mx);
          qy(my);
          requestAnimationFrame(check);
        };
        const onCursorScroll = () => moved && requestAnimationFrame(check);
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          window.addEventListener("mousemove", onMove);
          window.addEventListener("scroll", onCursorScroll, { passive: true });
        }

        // Magnetic buttons: the button and its label follow the pointer, then spring back.
        const magnets: (() => void)[] = [];
        mm.add("(min-width: 992px)", () => {
          qa("[data-magnetic-strength]").forEach((btn) => {
            const innerT = btn.querySelector<HTMLElement>("[data-magnetic-inner-target]");
            const s = parseFloat(btn.dataset.magneticStrength || "25");
            const si = parseFloat(btn.dataset.magneticStrengthInner || String(s));
            const enter = () => {
              gsap.killTweensOf([btn, innerT]);
              gsap.set([btn, innerT], { x: 0, y: 0, rotate: 0, clearProps: "all" });
            };
            const move = (e: MouseEvent) => {
              const rect = btn.getBoundingClientRect();
              const fx = (e.clientX - rect.left) / btn.offsetWidth - 0.5;
              const fy = (e.clientY - rect.top) / btn.offsetHeight - 0.5;
              gsap.to(btn, { x: fx * (s / 16) + "em", y: fy * (s / 16) + "em", rotate: "0.001deg", ease: "power4.out", duration: 1.6 });
              if (innerT) gsap.to(innerT, { x: fx * (si / 16) + "em", y: fy * (si / 16) + "em", rotate: "0.001deg", ease: "power4.out", duration: 2 });
            };
            const leave = () => {
              gsap.to(btn, { x: "0em", y: "0em", ease: "elastic.out(1, 0.3)", duration: 1.6, clearProps: "all" });
              if (innerT) gsap.to(innerT, { x: "0em", y: "0em", ease: "elastic.out(1, 0.3)", duration: 2, clearProps: "all" });
            };
            btn.addEventListener("mouseenter", enter);
            btn.addEventListener("mousemove", move);
            btn.addEventListener("mouseleave", leave);
            magnets.push(() => {
              btn.removeEventListener("mouseenter", enter);
              btn.removeEventListener("mousemove", move);
              btn.removeEventListener("mouseleave", leave);
            });
          });
          return () => magnets.splice(0).forEach((m) => m());
        });

        return () => {
          live = false;
          call?.kill();
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("scroll", onCursorScroll);
        };
      });

      // Problem box: one card that Flip-fits from the small slot to the full-width slot as you scroll.
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const wrappers = qa("[data-flip='wrapper']");
        const target = q("[data-flip='target']");
        let tl: gsap.core.Timeline | undefined;
        const build = () => {
          tl?.scrollTrigger?.kill();
          tl?.kill();
          gsap.set(target, { clearProps: "all" });
          tl = gsap.timeline({ scrollTrigger: { trigger: wrappers[0], start: "center center", endTrigger: wrappers[wrappers.length - 1], end: "center center", scrub: 0.25 } });
          wrappers.forEach((w, i) => {
            const nextW = wrappers[i + 1];
            if (!nextW) return;
            const a = w.getBoundingClientRect();
            const b = nextW.getBoundingClientRect();
            const dist = b.top + nextW.offsetHeight / 2 - (a.top + w.offsetHeight / 2);
            tl!.add(Flip.fit(target, nextW, { duration: dist, ease: "none" }) as gsap.core.Tween);
          });
        };
        build();
        let t: number | undefined;
        const onResize = () => {
          window.clearTimeout(t);
          t = window.setTimeout(build, 100);
        };
        window.addEventListener("resize", onResize);
        return () => {
          window.removeEventListener("resize", onResize);
          window.clearTimeout(t);
          tl?.scrollTrigger?.kill();
          tl?.kill();
          gsap.set(target, { clearProps: "all" });
        };
      });
      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 767px)", () => {
        gsap.fromTo(".scaling img", { scale: 1 }, { scale: 1.35, ease: "none", scrollTrigger: { trigger: ".problem__box.is--small", start: "top bottom", end: "bottom top", scrub: true } });
      });

      // Wheel, tabs and notifications need final font metrics, so wait for fonts.
      let alive = true;
      let wheelDown: (() => void) | undefined;
      let startW = window.innerWidth;
      let rt: number | undefined;
      const onWheelResize = () => {
        window.clearTimeout(rt);
        rt = window.setTimeout(() => {
          if (window.innerWidth === startW) return;
          startW = window.innerWidth;
          wheelDown?.();
          wheelDown = initRadial();
        }, 200);
      };
      document.fonts.ready.then(() => {
        if (!alive) return;
        wheelDown = initRadial();
        cleanups.push(initSteps(), initNotifs());
        window.addEventListener("resize", onWheelResize);
        ScrollTrigger.refresh();
      });

      return () => {
        alive = false;
        wheelDown?.();
        window.clearTimeout(rt);
        window.removeEventListener("resize", onWheelResize);
        cleanups.forEach((c) => c());
      };
    },
    { scope: root },
  );

  const wheel = [...cards, ...cards];

  return (
    <div ref={root} className={`gt ${poppins.variable} ${geistMono.variable} ${timesCondensed.variable}`}>
      <div className="loader" aria-hidden>
        <div className="loader__screen">
          <div className="loader__bg" />
          <div className="loader__list">
            {cards.slice(0, 5).map((c) => (
              <div key={c.src} className="loader__card">
                <Image src={c.src} alt="" fill sizes="20vw" priority />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="progressive-blur" aria-hidden>
        <div className="pb-1" />
        <div className="pb-2" />
        <div className="pb-3" />
        <div className="pb-4" />
        <div className="pb-5" />
      </div>

      <nav className="nav" aria-label="Main">
        <div className="nav__inner">
          <a href="#top" className="nav__logo" aria-label="The Joy Collective, back to top">
            <Wordmark horizontal />
          </a>
          <ul className="nav__links">
            <li><a href="#the-idea">The idea</a></li>
            <li><a href="#how-it-works">How it works</a></li>
            <li><a href="#circles">Circles</a></li>
            <li><a href="#founder">Our story</a></li>
          </ul>
          <Btn size="md" onClick={openModal}>
            Join the list
          </Btn>
        </div>
      </nav>

      <main>
        <section className="hero" id="top">
          <div className="hero__media">
            {/* 8s seamless loop cut from four clips, graded to one look (see public/media/d/SOURCES.md) */}
            <video className="hero__video" src="/media/d/hero-loop.mp4?v=sage" poster="/media/d/hero-loop-poster.jpg?v=sage" autoPlay muted loop playsInline preload="auto" aria-hidden />
          </div>
          <div className="hero__leaks" aria-hidden>
            <div className="hero__leak is--warm" />
          </div>
          <div className="hero__content">
            <h1 className="h1 hero__heading">
              Say the hard stuff.{" "}
              <br />
              Find the little joys.
            </h1>
            <p className="text-regular hero__body">
              Small circles of women for real conversations about mental health.{" "}
              <br />
              Nobody performs and nobody fixes. You leave feeling seen and heard.
            </p>
            <div className="hero__actions">
              <Btn onClick={openModal}>Join the list</Btn>
              <Btn variant="secondary" soon="Coming soon">
                Book a circle
              </Btn>
            </div>
          </div>
        </section>

        <div id="the-idea" className="idea-zone">
          <div className="bg-elements" aria-hidden>
            <div className="bg-wash is--warm-r" />
            <div className="bg-wash is--warm-l" />
            <div className="bg-wash is--white-1" />
            <div className="bg-wash is--white-2" />
          </div>
          <div className="idea-zone__content">
            <section className="problem">
              <div className="problem__intro">
                <div className="problem__container">
                  <h2 className="problem__heading">
                    <span className="visually-hidden">You meant to {problemWords.join(", ")}.</span>
                    <span aria-hidden>
                      You meant to{" "}
                      <br className="br-mobile" />
                      <span className="rot problem__word">
                        <span className="rot__inner">
                          {problemWords.map((w, i) => (
                            <span key={w} className="rot__word" style={i === 0 ? { position: "relative" } : { visibility: "hidden" }}>
                              {w}
                            </span>
                          ))}
                        </span>
                      </span>
                      <br />
                      but you said &ldquo;I&rsquo;m fine&rdquo; instead. Again.
                    </span>
                  </h2>
                  <div className="problem__box is--small">
                    <div className="scaling__before" />
                    <div data-flip="wrapper" className="scaling__wrapper">
                      <div data-flip="target" className="scaling">
                        <Image src={P.alone.src} alt={P.alone.alt} fill sizes="(min-width: 768px) 80vw, 100vw" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="problem__scrolled" aria-hidden>
                <div className="problem__box is--big">
                  <div className="scaling__before" />
                  <div data-flip="wrapper" className="scaling__wrapper" />
                </div>
              </div>
            </section>

            <section className="activities">
            <svg className="swirl is--activities" data-draw="reverse" viewBox="0 0 800 300" fill="none" aria-hidden>
              <path d="M-20 220 C 120 120, 260 60, 360 110 S 420 260, 330 250 S 300 120, 460 90 S 760 150, 870 290" strokeWidth="36" strokeLinecap="round" />
            </svg>
              <div className="section-head">
                <h2 className="h2">What if joy was something<br /> you could collect?</h2>
                <p className="sub">Little moments, noticed and gathered, can become a path forward.</p>
              </div>
              <div className="radial" data-drag="grab" role="region" aria-roledescription="carousel" aria-label="Little moments of joy">
                <div className="radial__collection">
                  <div className="radial__list" role="group" aria-label="Slides">
                    {wheel.map((c, i) => (
                      <div key={i} className="radial__item" aria-hidden={i >= cards.length || undefined}>
                        <article className="card">
                          <Image src={c.src} alt="" fill sizes="20em" draggable={false} />
                          <div className="card__scrim" />
                          <div className="card__label">
                            <div className="card__blur" aria-hidden>
                              <div className="is--1" />
                              <div className="is--2" />
                              <div className="is--3" />
                            </div>
                            <div className="card__tint" />
                            <h3 className="card__title on-dark">{c.title}</h3>
                          </div>
                        </article>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div id="how-it-works">
          <section className="steps">
            <div className="steps__layout">
              <div className="steps__col">
                <h2 className="h2">Just three<br /> simple steps</h2>
                <div role="tablist" aria-label="How it works" className="steps__list">
                  {steps.map((s, i) => (
                    <button key={s.title} type="button" role="tab" id={`step-tab-${i}`} aria-controls={`step-panel-${i}`} aria-selected={i === 0} tabIndex={i === 0 ? 0 : -1} className="steps__item">
                      <span className="steps__main">
                        <span className="steps__nr">{String(i + 1).padStart(2, "0")}</span>
                        <span className="steps__text">
                          <span className="steps__title">{s.title}</span>
                          <span className="steps__detail">
                            <span className="steps__detail-inner">{s.body}</span>
                          </span>
                        </span>
                      </span>
                      <span className="steps__rule">
                        <span className="steps__progress" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="steps__col is--visual">
                <div className="steps__visuals" aria-live="polite">
                  <div className="steps__wash" aria-hidden />
                  {steps.map((s, i) => (
                    <div key={s.title} id={`step-panel-${i}`} role="tabpanel" aria-labelledby={`step-tab-${i}`} className="steps__visual">
                      <div className="steps__photo">
                        <Image src={s.src} alt="" fill sizes="30em" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div id="circles">
          <section className="social">
            <div className="social__frame">
              <div className="social__media">
                <Image src={P.social.src} alt={P.social.alt} fill sizes="(min-width: 1280px) 80em, 100vw" />
              </div>
              <div className="social__vignette" aria-hidden />
              <div className="social__scrim" aria-hidden />
              <div className="social__content">
                <div className="social__text on-dark">
                  <h2 className="social__heading">You don&rsquo;t have to carry it alone</h2>
                  <p className="social__body">
                    A small circle where you can take off the armor, let your guard down and show up as you are. No likes, no follower counts, no advice you didn&rsquo;t ask for.
                  </p>
                </div>
                <div className="social__stack" aria-hidden>
                  {notifs.map((m, i) => (
                    <div key={m} className="notif" style={i === 3 ? { opacity: 0 } : undefined}>
                      <span className="notif__icon">
                        <SunMark />
                      </span>
                      <span className="notif__title">The Joy Collective</span>
                      <span className="notif__time">now</span>
                      <span className="notif__message">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Three bento cards: two stat cards and a photo with a stat chip. */}
          <section className="moments">
            <svg className="swirl is--features" viewBox="0 0 800 300" fill="none" aria-hidden>
              <path d="M-20 220 C 120 120, 260 60, 360 110 S 420 260, 330 250 S 300 120, 460 90 S 760 150, 870 290" strokeWidth="36" strokeLinecap="round" />
            </svg>
            <div className="section-head">
              <h2 className="h2" data-split>
                Actually, it&rsquo;s very simple
              </h2>
              <p className="sub">Just enough structure to make it feel safe.</p>
            </div>
            <div className="bento">
              <article className="bento__card is--soft">
                <span className="bento__icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9.5" r="2.5" /><path d="M3.5 19c.6-3 2.9-5 5.5-5s4.9 2 5.5 5" /><path d="M15 14.2c2.4-.4 4.6 1.2 5.3 4.3" /></svg>
                </span>
                <div className="bento__text">
                  <p className="bento__label">{features[0].title}</p>
                  {/* Draft figure for Adriana to confirm. */}
                  <p className="bento__stat">6-8</p>
                  <p className="bento__body">{features[0].body}</p>
                </div>
              </article>
              <article className="bento__card is--accent">
                <span className="bento__icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5.5h16v10H9.5L5 19.5v-4H4z" /><path d="M8 9.5h8M8 12.5h5" /></svg>
                </span>
                <div className="bento__text">
                  <p className="bento__label">{features[1].title}</p>
                  {/* Draft figure for Adriana to confirm. */}
                  <p className="bento__stat">90 min</p>
                  <p className="bento__body">{features[1].body}</p>
                  <div className="bento__faces" aria-hidden>
                    {cards.slice(0, 5).map((c) => (
                      <span key={c.src} className="bento__face">
                        <Image src={c.src} alt="" fill sizes="3em" />
                      </span>
                    ))}
                  </div>
                </div>
              </article>
              <article className="bento__card is--photo">
                <Image src={features[2].src} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" style={{ objectPosition: features[2].pos }} />
                <div className="bento__chip">
                  <p className="bento__chip-title">{features[2].title}</p>
                  <p className="bento__chip-body">{features[2].body}</p>
                </div>
              </article>
            </div>
          </section>

          {/* Founder note: excerpts from Adriana's letter beside a sticky portrait. */}
          <section className="letter" id="founder">
            <div className="letter__inner">
              <figure className="letter__media">
                <div className="letter__photo">
                  <Image src="/media/adriana-bench.jpg" alt="Adriana Cox smiling, seated on a wooden bench" fill sizes="(min-width: 992px) 34vw, 90vw" />
                </div>
                <figcaption className="letter__tag">Adriana Cox, founder</figcaption>
              </figure>
              <div className="letter__body">
                <span className="letter__eyebrow">A note from Adriana</span>
                <h2 className="h2 letter__greeting" data-split>
                  {letter.greeting}
                </h2>
                {letter.paragraphs.map((t) => (
                  <p key={t.slice(0, 24)} className="letter__p" data-letter-reveal>
                    {t}
                  </p>
                ))}
                <ul className="letter__values" data-letter-reveal>
                  {letter.values.map((v) => (
                    <li key={v.lead}>
                      <strong>{v.lead}</strong> {v.rest}
                    </li>
                  ))}
                </ul>
                <p className="letter__closing" data-letter-reveal>
                  {letter.closing}
                </p>
                <div className="letter__sign" data-letter-reveal>
                  <span>{letter.signoff}</span>
                  <span className="letter__name">{letter.name}</span>
                  <span className="letter__role">{letter.role}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="closing" id="bottom">
        <div className="closing__washes" aria-hidden>
          <div className="closing__wash is--1" />
          <div className="closing__wash is--2" />
        </div>
        <div className="closing__floor" aria-hidden />
        <section className="closing__cta" aria-labelledby="closing-heading">
          <div className="closing__text">
            <span className="closing__logo" aria-hidden>
              <Wordmark />
            </span>
            <h2 className="h2" id="closing-heading">
              Save your seat in the first circle
            </h2>
            <p className="text-regular">
              We&rsquo;re starting small, on purpose.
              <br />
              Join the list and we&rsquo;ll write when circles open.
            </p>
          </div>
          <div className="closing__actions">
            <Btn onClick={openModal}>Join the list</Btn>
            <Btn variant="secondary" href={SUBSTACK}>
              Read on Substack
            </Btn>
          </div>
        </section>
        <footer className="footer on-dark">
          <div className="footer__inner">
            <div className="footer__loop">
              <CurvedLoop marqueeText="joy collective" separator="✦" shape="arc" curveAmount={220} speed={1.5} scrollBoost={0.6} fontSize={150} fontWeight={600} letterSpacing={-6} color="#fff" className="footer__loop-text" />
            </div>
            <div className="footer__row">
              <p className="footer__meta">
                <span>&copy; 2026 The Joy Collective</span>
                <span className="footer__sep is--first" aria-hidden>|</span>
                <a data-underline-link href={SUBSTACK} target="_blank" rel="noreferrer">
                  Substack
                </a>
                <span className="footer__sep" aria-hidden>|</span>
                <a data-underline-link href={INSTAGRAM} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </p>
              <p className="footer__note">
                {disclaimer.split(/(?<=\.) /).map((line, i) => (
                  <span key={i}>{line}</span>
                ))}
              </p>
            </div>
          </div>
        </footer>
      </div>

      <div data-cursor="" className="cursor" aria-hidden>
        <div className="cursor__label">
          <span className="cursor__text">Coming soon</span>
        </div>
      </div>

      <div className="modal" data-modal={modal ? "active" : "not-active"}>
        <div className="modal__dark" onClick={() => setModal(false)} />
        <div ref={cardRef} className="modal__card" role="dialog" aria-modal="true" aria-labelledby="join-h" tabIndex={-1} inert={!modal}>
          <Image className="modal__mark" src="/media/d/icon-joycollective.svg" alt="" width={782} height={746} />
          <h2 className="modal__h" id="join-h">
            Join the list
          </h2>
          <p className="modal__p">We&rsquo;ll write when the first circles open. Nothing else.</p>
          <EmailForm tone="gt" />
          <button type="button" className="modal__close" aria-label="Close" onClick={() => setModal(false)}>
            <span />
            <span />
          </button>
        </div>
      </div>
    </div>
  );
}
