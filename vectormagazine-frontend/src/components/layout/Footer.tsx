"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { API_BASE_URL } from "@/lib/api";

const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Why Us", href: "#" },
  { label: "Team", href: "#" },
  { label: "Careers", href: "#" },
];

const menuLinks = [
  { label: "Partners & Certifications", href: "#" },
  { label: "Case Studies", href: "#" },
  { label: "Events & FAQ", href: "#" },
  { label: "Solutions", href: "#" },
  { label: "Reviews & Awards", href: "#" },
];

const bottomLinks = [
  "Home",
  "About Us",
  "Contact Us",
  "Privacy Policy",
  "Terms and Conditions",
];

// Custom Pinterest Icon to match the thinner/cleaner style if needed, 
// or you can just use the standard one.
const Pinterest = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 20l2-6" />
    <path d="M10 14c1.5.5 2 .75 3.5.75 3.5 0 5.5-3 5.5-6.25S16.5 2 12 2 3 4.75 3 10c0 2.6 1 4.67 3 5.7" />
    <path d="M8 20c-.2-1 .6-4 1.2-6" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to subscribe");

      setMessage(data.message || "Subscribed successfully!");
      setEmail("");
    } catch (error: any) {
      setIsError(true);
      setMessage(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-muted text-foreground overflow-hidden font-sans border-t border-border">

      {/* 1. Top Social Grid Row */}
      {/* Border bottom separates it from the main content */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {/* Social Item 1 */}
            <Link
              href="#"
              className="group flex items-center justify-center gap-3 py-8 border-b md:border-b-0 lg:border-r border-border hover:bg-background transition-colors"
            >
              <div className="bg-background p-2 rounded-full text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
                <Facebook size={16} />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground uppercase tracking-wider">Facebook</span>
            </Link>

            {/* Social Item 2 */}
            <Link
              href="#"
              className="group flex items-center justify-center gap-3 py-8 border-b md:border-b-0 lg:border-r border-border hover:bg-background transition-colors"
            >
              <div className="bg-background p-2 rounded-full text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
                <Twitter size={16} />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground uppercase tracking-wider">X Network</span>
            </Link>

            {/* Social Item 3 */}
            <Link
              href="#"
              className="group flex items-center justify-center gap-3 py-8 border-b md:border-b-0 lg:border-r border-border hover:bg-background transition-colors"
            >
              <div className="bg-background p-2 rounded-full text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
                <Pinterest size={16} />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground uppercase tracking-wider">Pinterest</span>
            </Link>

            {/* Social Item 4 */}
            <Link
              href="#"
              className="group flex items-center justify-center gap-3 py-8 hover:bg-background transition-colors"
            >
              <div className="bg-background p-2 rounded-full text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
                <Instagram size={16} />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground uppercase tracking-wider">Instagram</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Column 1: Logo & Desc (Span 4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Logo Construction */}
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center h-10 w-10">
                {/* Visual approximation of the VECTOR logo circle */}
                <span className="absolute inset-0 rounded-full border-[3px] border-primary opacity-80"></span>
                <span className="absolute inset-0 bg-primary opacity-20 rounded-full"></span>
              </div>
              <div>
                <h2 className="text-2xl font-extrabold tracking-widest leading-none text-foreground">VECTOR</h2>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
                  Creative Magazine <span className="text-muted-foreground/50">//</span>
                </p>
              </div>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Our platform covers everything from global events and politics to entertainment,
              technology, and lifestyle, ensuring you never miss a story.
            </p>
          </div>

          {/* Column 2: Links (Span 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground whitespace-nowrap">Links</h3>
              <div className="h-[1px] w-full bg-border"></div>
            </div>
            <ul className="space-y-3">
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Menu (Span 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground whitespace-nowrap">Menu</h3>
              <div className="h-[1px] w-full bg-border"></div>
            </div>
            <ul className="space-y-3">
              {menuLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter (Span 4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground whitespace-nowrap">Newsletter</h3>
              <div className="h-[1px] w-full bg-border"></div>
            </div>

            {/* Input Field with Button */}
            <form onSubmit={handleSubscribe} className="relative group max-w-sm">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-border py-6 pr-32 text-sm text-foreground placeholder:text-muted-foreground rounded-none focus-visible:ring-0 focus-visible:border-primary transition-colors pl-0"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary hover:bg-foreground hover:text-background text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-full h-8 px-6 disabled:opacity-50"
              >
                {isLoading ? 'Wait...' : 'Subscribe'}
              </Button>
            </form>

            <div className="min-h-[20px]">
              {message && (
                <p className={`text-xs ${isError ? 'text-red-500' : 'text-green-500'}`}>
                  {message}
                </p>
              )}
              {!message && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  I consent to receive newsletter via email. for further information, please review our{" "}
                  <Link href="#" className="text-foreground hover:text-primary transition-colors underline decoration-border underline-offset-4">
                    Privacy Policy
                  </Link>
                </p>
              )}
            </div>
          </div>

        </div>

        {/* 3. Bottom Copyright Bar */}
        <div className="mt-20 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {bottomLinks.map((item) => (
              <Link key={item} href="#" className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors">
                {item}
              </Link>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest">
            Copyright © 2025 VECTOR. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}