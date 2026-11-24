"use client";

import { useId, useState } from "react";

const tones = {
  light: {
    wrap: "glass",
    input: "text-white placeholder:text-white/80",
    button: "bg-white text-ink hover:bg-ink hover:text-white",
    note: "text-white/90",
  },
  dark: {
    wrap: "bg-white ring-1 ring-ink/15",
    input: "text-ink placeholder:text-ink-50",
    button: "bg-ink text-white hover:bg-blue",
    note: "text-ink-75",
  },
  // Mockup C: warm stone field with a near-black button, after the Soma reference.
  stone: {
    wrap: "bg-[#e8e4da] shadow-[0_10px_30px_-12px_rgba(30,29,25,0.35)]",
    input: "text-[#1e1d19] placeholder:text-[#1e1d19]/55",
    button: "bg-[#1e1d19] text-[#f6f3ec] hover:bg-[#3a372f]",
    note: "text-[#1e1d19]/70",
  },
};

// Mockup only: no backend yet. Swap the submit handler for the real list provider before launch.
export default function EmailForm({
  tone = "light",
  compact = false,
}: {
  tone?: keyof typeof tones;
  compact?: boolean;
}) {
  const id = useId();
  const [done, setDone] = useState(false);
  const t = tones[tone];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className="w-full max-w-md"
    >
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className={`flex items-center gap-2 rounded-full p-1.5 pl-5 ${t.wrap}`}>
        <input
          id={id}
          type="email"
          required
          disabled={done}
          placeholder="Your email"
          className={`min-w-0 flex-1 bg-transparent py-2 text-[15px] outline-none ${t.input}`}
        />
        <button
          type="submit"
          disabled={done}
          className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${t.button}`}
        >
          {done ? "You're in" : "Join the list"}
        </button>
      </div>
      <p aria-live="polite" className={compact ? "sr-only" : `mt-3 pl-5 text-sm ${t.note}`}>
        {done ? "Thank you. We'll write when the first circles open." : "No spam. Just the news when circles open."}
      </p>
    </form>
  );
}
