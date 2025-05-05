"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, FolderIcon as SpiderIcon, MenuIcon, XIcon, LogInIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <SpiderIcon className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl hidden sm:inline-block">BARGUS</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/history" className="text-sm font-medium hover:text-primary transition-colors">
            History
          </Link>
          <Link href="/saved" className="text-sm font-medium hover:text-primary transition-colors">
            Saved
          </Link>
          <Link href="/docs" className="text-sm font-medium hover:text-primary transition-colors">
            Documentation
          </Link>
        </nav>

        <div className="flex items-center gap-2">

        <Link href="/login">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <LogInIcon className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </Link>

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

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background">
          <Link
            href="/"
            className="block px-4 py-2 text-sm rounded-md hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/history"
            className="block px-4 py-2 text-sm rounded-md hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            History
          </Link>
          <Link
            href="/saved"
            className="block px-4 py-2 text-sm rounded-md hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Saved
          </Link>
          <Link
            href="/docs"
            className="block px-4 py-2 text-sm rounded-md hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Documentation
          </Link>
        </div>
      )}
    </header>
  );
}