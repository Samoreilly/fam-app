"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FAMILY_MEMBERS } from "@/lib/supabase";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", emoji: "🏠" },
    { href: "/foods", label: "Foods", emoji: "🍕" },
    { href: "/overlaps", label: "Overlaps", emoji: "🎯" },
  ];

  return (
    <nav className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-lg shadow-amber-500/20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-white"
          >
            <span className="text-2xl">🍽️</span>
            FamFoods
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  pathname === link.href
                    ? "bg-white text-amber-600 shadow-md"
                    : "text-white/90 hover:bg-white/20 hover:text-white"
                }`}
              >
                <span className="mr-1">{link.emoji}</span>
                {link.label}
              </Link>
            ))}

            <div className="ml-2 pl-2 border-l border-white/30">
              {FAMILY_MEMBERS.map((member) => (
                <Link
                  key={member}
                  href={`/person/${member}`}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    pathname === `/person/${member}`
                      ? "bg-white text-amber-600 shadow-md"
                      : "text-white/90 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {member}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  pathname === link.href
                    ? "bg-white text-amber-600"
                    : "text-white/90 hover:bg-white/20"
                }`}
              >
                <span className="mr-2">{link.emoji}</span>
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/30 pt-2 mt-2">
              <p className="px-4 py-1 text-xs font-medium text-white/60 uppercase tracking-wider">
                Family
              </p>
              <div className="grid grid-cols-2 gap-1 px-2">
                {FAMILY_MEMBERS.map((member) => (
                  <Link
                    key={member}
                    href={`/person/${member}`}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      pathname === `/person/${member}`
                        ? "bg-white text-amber-600"
                        : "text-white/90 hover:bg-white/20"
                    }`}
                  >
                    {member}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
