// components/navbar-client.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavPublic() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop */}
      <nav className="hidden sm:flex items-center gap-6">
        <a
          href="#features"
          className="text-sm text-gray-500 hover:text-gray-900 transition"
        >
          Features
        </a>
        <a
          href="#how-it-works"
          className="text-sm text-gray-500 hover:text-gray-900 transition"
        >
          How It Works
        </a>
        <Link
          href="/tailor"
          className="text-sm text-gray-500 hover:text-gray-900 transition"
        >
          Tailor Resume
        </Link>
        <Link
          href="/sign-in"
          className="text-sm text-gray-500 hover:text-gray-900 transition"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="bg-gray-900 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition"
        >
          Get Started →
        </Link>
      </nav>

      {/* Mobile hamburger */}
      <button
        className="sm:hidden p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className="block w-5 h-0.5 bg-current mb-1" />
        <span className="block w-5 h-0.5 bg-current mb-1" />
        <span className="block w-5 h-0.5 bg-current" />
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-4 sm:hidden">
          <a
            href="#features"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-700"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-700"
          >
            How It Works
          </a>
          <Link
            href="/tailor"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-700"
          >
            Tailor Resume
          </Link>
          <Link
            href="/sign-in"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-700"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            onClick={() => setMenuOpen(false)}
            className="bg-gray-900 text-white px-3.5 py-2 rounded-lg text-sm font-medium text-center"
          >
            Get Started →
          </Link>
        </div>
      )}
    </>
  );
}

export function NavAuth() {
  return (
    <nav className="flex items-center gap-6">
      <Link
        href="/dashboard"
        className="text-sm text-gray-500 hover:text-gray-900 transition"
      >
        Dashboard
      </Link>
      <Link
        href="/tailor"
        className="bg-gray-900 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition"
      >
        Tailor Resume
      </Link>
    </nav>
  );
}
