import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { Portfolio } from "@/components/portfolio"
import { About } from "@/components/about"
import { Contact } from "@/components/contact"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Portfolio />
      <About />
      <Contact />
    </main>
  )
}
