"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FAMILY_MEMBERS } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/foods", label: "Foods" },
    { href: "/overlaps", label: "Overlaps" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            FamFoods
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="ml-2 pl-2 border-l border-gray-200">
              {FAMILY_MEMBERS.map((member) => (
                <Link
                  key={member}
                  href={`/person/${member}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === `/person/${member}`
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {member}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  pathname === link.href
                    ? "bg-gray-900 text-white"
                    : "text-gray-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
