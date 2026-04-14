"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";

const navMenu = [
  {
    id: "home",
    title: "Home",
    link: "/"
  },
  {
    id: "news",
    title: "News",
    link: "/news"
  },
  {
    id: "organizations",
    title: "Organizations",
    link: "/organizations"
  },
  {
    id: "courses",
    title: "Courses",
    link: "/courses"
  },
  {
    id: "contact-us",
    title: "Contact Us",
    link: "/#contact"
  },
]

function isActive(pathname: string, link: string) {
  if (link === "/") return pathname === "/";
  if (link.startsWith("/#")) return pathname === "/";
  return pathname.startsWith(link);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList className="flex-wrap">
          {navMenu.map((item) => (
            <NavigationMenuItem key={item.id}>
              <NavigationMenuLink asChild className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent transition-colors",
                isActive(pathname, item.link)
                  ? "text-brand-blue font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}>
                <Link href={item.link}>{item.title}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetHeader>
              <SheetTitle className="text-brand-blue">Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1">
              {navMenu.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive(pathname, item.link)
                      ? "bg-brand-blue/10 text-brand-blue"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
