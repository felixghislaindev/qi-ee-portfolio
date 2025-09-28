"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsOpen(false)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="bold-artistic">QI EE</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection("work")}
              className="artistic-text hover:text-accent-foreground transition-colors"
            >
              work
            </button>
            <Link href="/photography" className="artistic-text hover:text-accent-foreground transition-colors">
              photography
            </Link>
            <button
              onClick={() => scrollToSection("about")}
              className="artistic-text hover:text-accent-foreground transition-colors"
            >
              about
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="artistic-text hover:text-accent-foreground transition-colors"
            >
              contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("work")}
                className="text-left artistic-text hover:text-accent-foreground transition-colors"
              >
                work
              </button>
              <Link
                href="/photography"
                className="text-left artistic-text hover:text-accent-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                photography
              </Link>
              <button
                onClick={() => scrollToSection("about")}
                className="text-left artistic-text hover:text-accent-foreground transition-colors"
              >
                about
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-left artistic-text hover:text-accent-foreground transition-colors"
              >
                contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
