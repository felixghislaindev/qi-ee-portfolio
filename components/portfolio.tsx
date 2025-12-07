"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePhotographyImages } from "@/hooks/use-photography-images";

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
];

const categories = [
  "All",
  "Portrait",
  "Street",
  "Conceptual",
  "Fashion",
  "Documentary",
];

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [displayedItems, setDisplayedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { images, getImageUrl } = usePhotographyImages();

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);

      // Use Cloudinary images if available, otherwise fallback to local portfolioItems
      const portfolioData = images.length ? images : portfolioItems;

      // Filter by category
      const filteredItems =
        selectedCategory === "All"
          ? portfolioData
          : portfolioData.filter(
              (item: any) =>
                item.category === selectedCategory ||
                item.tags?.includes(selectedCategory.toLowerCase())
            );

      // Randomize and limit to 6 images
      const shuffledItems = [...filteredItems]
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);

      setDisplayedItems(shuffledItems);
      setLoading(false);
    };

    loadImages();
  }, [images, selectedCategory]);

  return (
    <section id="work" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bold-artistic">
            Selected Work
          </h2>
          <p className="text-lg artistic-text text-muted-foreground max-w-2xl mx-auto">
            A curated collection of my favorite pieces, each telling its own
            unique story
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
        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedItems.map((item: any) => (
              <Link
                key={item.id}
                href="/photography"
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden bg-muted aspect-[4/5]">
                  <img
                    src={
                      getImageUrl
                        ? getImageUrl(item, { width: 800, height: 1000 })
                        : item.image || "/placeholder.svg"
                    }
                    alt={item.title || "Portfolio Image"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      console.error("❌ Image failed to load:", {
                        src: e.currentTarget.src,
                        publicId: item.publicId,
                        title: item.title,
                      });
                    }}
                    onLoad={() => {
                      if (displayedItems.indexOf(item) < 2) {
                        console.log("✅ Image loaded successfully:", {
                          src: (document.querySelector(`img[alt="${item.title}"]`) as HTMLImageElement)?.src,
                          title: item.title,
                        });
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white text-black px-4 py-2 artistic-text font-semibold">
                      View Gallery
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-muted-foreground artistic-text">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm artistic-text text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Link */}
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
  );
}
