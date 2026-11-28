import type { Metadata, Viewport } from "next";
import MockupD from "@/components/MockupD";
import "./d.css";

export const metadata: Metadata = { title: "The Joy Collective (Mockup D)" };
// Phone browser chrome matches the cream page.
export const viewport: Viewport = { themeColor: "#f0ece0", colorScheme: "light" };

export default function Page() {
  return <MockupD />;
}
