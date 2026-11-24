import Link from "next/link";

// Review aid for the client: flip between the two mockups. Remove before launch.
export default function Switcher({ current }: { current: "a" | "b" | "c" }) {
  const item = (key: "a" | "b" | "c", href: string, label: string) => (
    <Link
      href={href}
      aria-current={current === key ? "page" : undefined}
      className={`whitespace-nowrap rounded-full px-4 py-2 transition-colors ${
        current === key ? "bg-white text-ink" : "text-white/80 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
  return (
    <nav
      aria-label="Mockup versions"
      className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full bg-ink/85 p-1 text-sm font-medium shadow-lg backdrop-blur"
    >
      {item("a", "/", "Mockup A")}
      {item("b", "/b", "Mockup B")}
      {item("c", "/c", "Mockup C")}
    </nav>
  );
}
