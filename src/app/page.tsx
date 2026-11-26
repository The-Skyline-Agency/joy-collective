import type { Metadata } from "next";
import MockupD from "@/components/MockupD";
import "./d/d.css";

export const metadata: Metadata = { title: "The Joy Collective (Mockup D)" };

export default function Page() {
  return <MockupD />;
}
