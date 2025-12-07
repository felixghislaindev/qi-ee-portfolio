"use client"

import { useState, useEffect } from "react"
import { getCloudinaryVideoUrl, fetchCloudinaryVideos, type CloudinaryVideo } from "@/lib/cloudinary"

// Project definitions - videos will be assigned from Cloudinary OR YouTube
// To use YouTube: add youtubeUrl property with any YouTube URL format:
//   - https://www.youtube.com/watch?v=VIDEO_ID
//   - https://youtu.be/VIDEO_ID
//   - https://www.youtube.com/embed/VIDEO_ID
const projectDefinitions = [
  {
    id: "delish-cube",
    title: "Delish Cube – H&S Delight Sdn Bhd",
    description: [
      "Assisted in planning and executing public relations and promotional strategies for Delish Cube.",
      "Created engaging content and visuals for social media campaigns to increase brand awareness.",
      "Coordinated with team members to ensure smooth project workflow and timely deliverables.",
      "Presented project results and insights to supervisors, contributing to the company's marketing objectives.",
    ],
    youtubeUrl: "https://youtu.be/x70SqflBl0Y?si=8AO0Jb8oEFKpz_Ua",
  },
  {
    id: "you-digital",
    title: "You Digital Company",
    description: [
      "Collaborated with team members to plan and execute the digital marketing project.",
      "Assisted in creating content, designing visuals, and building personal branding.",
      "Conducted research and analysis to support project strategy and decision-making.",
      "Presented project outcomes to instructors and received positive feedback on creativity and teamwork.",
    ],
    // Example: Add YouTube URL here if you want to use YouTube instead of Cloudinary
    // youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  },
]

interface ProjectItem {
  id: string
  title: string
  description: string[]
  videoPublicId?: string // Cloudinary public ID
  videoVersion?: number // Cloudinary version for cache busting
  youtubeUrl?: string // YouTube video URL (alternative to Cloudinary)
}

export function Projects() {
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProjects() {
      setLoading(true)
      try {
        const videos = await fetchCloudinaryVideos()
        
        // Assign videos to projects in order:
        // videos[0] → Delish Cube
        // videos[1] → You Digital Company
        const assignedProjects: ProjectItem[] = projectDefinitions.map((project, index) => {
          const video = videos[index]
          return {
            id: project.id,
            title: project.title,
            description: project.description,
            videoPublicId: video?.publicId || undefined,
            videoVersion: video?.version, // Store version for cache busting
            youtubeUrl: (project as any).youtubeUrl || undefined, // Allow YouTube URLs in project definitions
          }
        }).filter(project => project.videoPublicId || project.youtubeUrl) // Only include projects with videos

        setProjects(assignedProjects)
      } catch (error) {
        console.error("Error loading projects:", error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const getVideoUrl = (publicId: string, version?: number) => {
    return getCloudinaryVideoUrl(publicId, {
      quality: "auto",
      format: "auto",
      version, // Include version for cache busting
    })
  }

  // Convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url: string): string => {
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`
      }
    }

    // If no match, return original URL (might already be embed format)
    return url
  }

  // Check if a URL is a YouTube URL
  const isYouTubeUrl = (url?: string): boolean => {
    if (!url) return false
    return /youtube\.com|youtu\.be/.test(url)
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

        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-background border border-border overflow-hidden"
              >
                {/* Video */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {project.youtubeUrl ? (
                    // YouTube embed
                    <iframe
                      src={getYouTubeEmbedUrl(project.youtubeUrl)}
                      title={project.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      frameBorder="0"
                    />
                  ) : project.videoPublicId ? (
                    // Cloudinary video
                    <video
                      src={getVideoUrl(project.videoPublicId, project.videoVersion)}
                      controls
                      className="w-full h-full object-cover"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    // Fallback placeholder
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No video available
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-4 bold-artistic">
                    {project.title}
                  </h3>
                  <ul className="space-y-2 artistic-text text-muted-foreground">
                    {project.description.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
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

