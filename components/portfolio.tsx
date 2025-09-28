"use client"

import { useState } from "react"
import Link from "next/link"

const portfolioItems = [
  {
    id: 1,
    title: "Urban Portraits",
    category: "Portrait",
    image: "/urban-portrait-photography-black-and-white-street-.jpg",
    description: "Capturing authentic moments in urban environments",
  },
  {
    id: 2,
    title: "Street Stories",
    category: "Street",
    image: "/street-photography-candid-moments-city-life.jpg",
    description: "Documenting life as it unfolds on city streets",
  },
  {
    id: 3,
    title: "Conceptual Series",
    category: "Conceptual",
    image: "/conceptual-photography-artistic-creative-abstract.jpg",
    description: "Exploring ideas through visual metaphors",
  },
  {
    id: 4,
    title: "Fashion Editorial",
    category: "Fashion",
    image: "/fashion-photography-editorial-style-model-artistic.jpg",
    description: "Editorial work for emerging designers",
  },
  {
    id: 5,
    title: "Documentary Work",
    category: "Documentary",
    image: "/documentary-photography-real-life-authentic-moment.jpg",
    description: "Real stories from real people",
  },
  {
    id: 6,
    title: "Night Scenes",
    category: "Street",
    image: "/night-photography-urban-lights-street-scenes-moody.jpg",
    description: "The city after dark",
  },
]

const categories = ["All", "Portrait", "Street", "Conceptual", "Fashion", "Documentary"]

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredItems =
    selectedCategory === "All" ? portfolioItems : portfolioItems.filter((item) => item.category === selectedCategory)

  return (
    <section id="work" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bold-artistic">Selected Work</h2>
          <p className="text-lg artistic-text text-muted-foreground max-w-2xl mx-auto">
            A curated collection of my favorite pieces, each telling its own unique story
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 artistic-text transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Link key={item.id} href="/photography" className="group cursor-pointer">
              <div className="relative overflow-hidden bg-muted">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white text-black px-4 py-2 artistic-text font-semibold">View Gallery</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold bold-artistic">{item.title}</h3>
                  <span className="text-sm text-muted-foreground artistic-text">{item.category}</span>
                </div>
                <p className="text-sm artistic-text text-muted-foreground">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/photography"
            className="inline-block px-8 py-3 border border-border hover:bg-accent hover:text-accent-foreground transition-colors artistic-text"
          >
            View All Photography
          </Link>
        </div>
      </div>
    </section>
  )
}
