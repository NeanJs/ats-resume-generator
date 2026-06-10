// components/navbar.tsx  (server component stays clean)
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { NavPublic, NavAuth } from "./nav-client";
import Logo from "@/public/logo.ico";
import Image from "next/image";
export default async function Navbar() {
  const { userId } = await auth();
  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white backdrop-blur-md z-20">
      <div className="relative max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href={userId ? "/dashboard" : "/"}
          className="flex items-center gap-2"
        >
          {/* Swap the black square for something on-brand */}
          <Image
            src={Logo}
            className="w-10"
            alt="logo"
            width={100}
            height={100}
          />
          <span className="text-sm font-semibold tracking-tight text-gray-700">
            ApplyCraft
          </span>
        </Link>

        {!userId && <NavPublic />}
        {userId && (
          <div className="flex items-center gap-6">
            <NavAuth />
            <UserButton />
          </div>
        )}
      </div>
    </header>
  );
}
