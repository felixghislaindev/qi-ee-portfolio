"use client"

import { useState, useEffect } from "react"
import { getCloudinaryVideoUrl, fetchCloudinaryVideos, type CloudinaryVideo } from "@/lib/cloudinary"

export function Projects() {
  const [videos, setVideos] = useState<CloudinaryVideo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadVideos() {
      setLoading(true)
      try {
        const cloudinaryVideos = await fetchCloudinaryVideos()
        // Randomize the order
        const shuffledVideos = [...cloudinaryVideos].sort(() => Math.random() - 0.5)
        setVideos(shuffledVideos)
      } catch (error) {
        console.error("Error loading videos:", error)
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [])

  const getVideoUrl = (publicId: string) => {
    return getCloudinaryVideoUrl(publicId, {
      quality: "auto",
      format: "auto",
    })
  }

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bold-artistic">
            Projects
          </h2>
          <p className="text-lg artistic-text text-muted-foreground max-w-2xl mx-auto">
            A collection of my work showcasing creativity, collaboration, and strategic thinking
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        )}

        {/* Videos Grid */}
        {!loading && videos.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-background border border-border overflow-hidden"
              >
                {/* Video */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <video
                    src={getVideoUrl(video.publicId)}
                    controls
                    className="w-full h-full object-cover"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 bold-artistic">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="artistic-text text-muted-foreground">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && videos.length === 0 && (
          <div className="text-center py-12">
            <p className="artistic-text text-muted-foreground">
              No videos available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

