"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  MoonIcon,
  SunIcon,
  FolderIcon as SpiderIcon,
  LogInIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomSession extends Session {
  user?: {
    name?: string | null;
    email?: string | null;
    username?: string;
  };
}

export default function Header() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [localUsername, setLocalUsername] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession() as {
    data: CustomSession | null;
    status: string;
  };

  useEffect(() => {
    setMounted(true);
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setLocalUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("username");
     window.location.reload();
  };

  const displayUsername = localUsername;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <SpiderIcon className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl hidden sm:inline-block">
              BARGUS
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/history"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Your Products
          </Link>
          <Link
            href="/saved"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Add Products
          </Link>
          <Link
            href="/docs"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* Authenticated */}
          { displayUsername ? (
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <UserIcon className="h-4 w-4" />
                     Hi, {displayUsername}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            // Unauthenticated
            <Link href="/login">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <LogInIcon className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}

          {/* Theme toggle */}
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  {theme === "light" ? (
                    <SunIcon className="h-4 w-4" />
                  ) : (
                    <MoonIcon className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
