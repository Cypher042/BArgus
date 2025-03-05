"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Menu, User } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"

export default function Navbar() {
  const [notificationCount, setNotificationCount] = useState(3)

  const notifications = [
    { id: 1, message: "New feature released", time: "2 minutes ago" },
    { id: 2, message: "Your subscription will expire soon", time: "1 hour ago" },
    { id: 3, message: "New message from admin", time: "Yesterday" },
  ]

  const markAllAsRead = () => {
    setNotificationCount(0)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-6 py-4">
                <Link href="/" className="text-xl font-bold">
                  MyApp
                </Link>
                <div className="flex flex-col gap-2">
                  <Link href="/features" className="text-sm font-medium hover:underline">
                    Features
                  </Link>
                  <Link href="/pricing" className="text-sm font-medium hover:underline">
                    Pricing
                  </Link>
                  <Link href="/about" className="text-sm font-medium hover:underline">
                    About
                  </Link>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-sm font-medium">Resources</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2 pl-4">
                        <Link href="/docs" className="text-sm hover:underline">
                          Documentation
                        </Link>
                        <Link href="/blog" className="text-sm hover:underline">
                          Blog
                        </Link>
                        <Link href="/support" className="text-sm hover:underline">
                          Support
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="text-xl font-bold">
            MyApp
          </Link>
        </div>

        <div className="hidden md:flex md:items-center md:gap-6">
          <Link href="/features" className="text-sm font-medium hover:underline">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:underline">
            Pricing
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline">
            About
          </Link>
          <Accordion type="single" collapsible className="w-auto">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="flex items-center gap-1 py-0 text-sm font-medium hover:no-underline">
                Resources
              </AccordionTrigger>
              <AccordionContent className="absolute bg-background p-2 shadow-md">
                <div className="flex flex-col gap-2">
                  <Link href="/docs" className="text-sm hover:underline">
                    Documentation
                  </Link>
                  <Link href="/blog" className="text-sm hover:underline">
                    Blog
                  </Link>
                  <Link href="/support" className="text-sm hover:underline">
                    Support
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {notificationCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <div className="flex items-center justify-between p-2">
                <h3 className="font-medium">Notifications</h3>
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex cursor-pointer flex-col items-start p-3">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/login">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/signup">Sign Up</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}

