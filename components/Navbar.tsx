"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 font-extrabold text-xl tracking-tight">
          <span style={{ color: "#1A2C4E" }}>Go</span>
          <span style={{ color: "#FFB703" }}>Bela</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#1A2C4E]">
          <Link href="/#features" className="hover:text-[#2FB7A8] transition-colors">Features</Link>
          <Link href="/#how-it-works" className="hover:text-[#2FB7A8] transition-colors">How It Works</Link>
          <Link href="/about" className="hover:text-[#2FB7A8] transition-colors">About</Link>
          <Link href="/partners" className="hover:text-[#2FB7A8] transition-colors">For Partners</Link>
          <a
            href="#download"
            className="bg-[#FFB703] text-white px-4 py-2 rounded-full hover:bg-[#e6a500] transition-colors"
          >
            Download App
          </a>
        </div>

        {/* Hamburger */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-[#1A2C4E] transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[#1A2C4E] transition-all ${open ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-[#1A2C4E] transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 flex flex-col gap-4 text-sm font-semibold text-[#1A2C4E]">
          <Link href="/#features" onClick={() => setOpen(false)}>Features</Link>
          <Link href="/#how-it-works" onClick={() => setOpen(false)}>How It Works</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
          <Link href="/partners" onClick={() => setOpen(false)}>For Partners</Link>
          <a href="#download" onClick={() => setOpen(false)}
            className="bg-[#FFB703] text-white text-center px-4 py-2 rounded-full">
            Download App
          </a>
        </div>
      )}
    </nav>
  );
}
