"use client";

import { useId, useState } from "react";

// Mockup only: no backend yet. Swap the submit handler for the real list provider before launch.
export default function EmailForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const id = useId();
  const [done, setDone] = useState(false);
  const dark = tone === "dark";

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
      <div
        className={`flex items-center gap-2 rounded-full p-1.5 pl-5 ${
          dark ? "bg-white ring-1 ring-ink/15" : "glass"
        }`}
      >
        <input
          id={id}
          type="email"
          required
          disabled={done}
          placeholder="Your email"
          className={`min-w-0 flex-1 bg-transparent py-2 text-[15px] outline-none ${
            dark ? "text-ink placeholder:text-ink-50" : "text-white placeholder:text-white/80"
          }`}
        />
        <button
          type="submit"
          disabled={done}
          className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
            dark ? "bg-ink text-white hover:bg-blue" : "bg-white text-ink hover:bg-ink hover:text-white"
          }`}
        >
          {done ? "You're in" : "Join the list"}
        </button>
      </div>
      <p aria-live="polite" className={`mt-3 pl-5 text-sm ${dark ? "text-ink-75" : "text-white/90"}`}>
        {done ? "Thank you. We'll write when the first circles open." : "No spam. Just the news when circles open."}
      </p>
    </form>
  );
}
