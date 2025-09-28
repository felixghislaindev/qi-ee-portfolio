"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { usePhotographyImages } from "@/hooks/use-photography-images"

const ITEMS_PER_PAGE = 6

export default function PhotographyPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const { images, loading, error, getImageUrl, isUsingCloudinary } = usePhotographyImages()

  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentItems = images.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="artistic-text">Loading photography...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <p className="artistic-text text-muted-foreground">Showing local images as fallback</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 artistic-text"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>

          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bold-artistic">Photography</h1>
            <p className="text-lg artistic-text text-muted-foreground max-w-2xl mx-auto">
              A comprehensive collection of my photographic work, spanning various styles and subjects
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {isUsingCloudinary ? "Images loaded from Cloudinary" : "Using local images"}
            </p>
          </div>
        </div>

        {/* Photography Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentItems.map((item, index) => (
            <div key={item.id} className="group cursor-pointer" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="relative overflow-hidden bg-muted aspect-[4/5]">
                <img
                  src={getImageUrl(item, { width: 800, height: 1000 || "/placeholder.svg" }) || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                {/* Overlay info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-semibold bold-artistic mb-1">{item.title}</h3>
                  <p className="text-white/80 text-sm artistic-text">{item.description}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold bold-artistic">{item.title}</h3>
                  <span className="text-sm text-muted-foreground artistic-text">{item.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mb-20">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-border hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full artistic-text transition-colors ${
                    currentPage === page
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-border hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
