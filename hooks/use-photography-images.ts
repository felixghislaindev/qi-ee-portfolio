"use client";

import { useState, useEffect } from "react";
import {
  CLOUDINARY_CONFIG,
  fetchCloudinaryImages,
  getCloudinaryUrl,
} from "@/lib/cloudinary";

// Local dummy images (current setup)
const localImages = [
  {
    id: 1,
    title: "Urban Portraits",
    image: "/urban-portrait-photography-black-and-white-street-.jpg",
    description: "Capturing authentic moments in urban environments",
    year: "2024",
  },
  {
    id: 2,
    title: "Street Stories",
    image: "/street-photography-candid-moments-city-life.jpg",
    description: "Documenting life as it unfolds on city streets",
    year: "2024",
  },
  {
    id: 3,
    title: "Conceptual Series",
    image: "/conceptual-photography-artistic-creative-abstract.jpg",
    description: "Exploring ideas through visual metaphors",
    year: "2023",
  },
  {
    id: 4,
    title: "Fashion Editorial",
    image: "/fashion-photography-editorial-style-model-artistic.jpg",
    description: "Editorial work for emerging designers",
    year: "2024",
  },
  {
    id: 5,
    title: "Documentary Work",
    image: "/documentary-photography-real-life-authentic-moment.jpg",
    description: "Real stories from real people",
    year: "2023",
  },
  {
    id: 6,
    title: "Night Scenes",
    image: "/night-photography-urban-lights-street-scenes-moody.jpg",
    description: "The city after dark",
    year: "2024",
  },
  {
    id: 7,
    title: "Abstract Compositions",
    image: "/abstract-artistic-photography-composition.jpg",
    description: "Playing with form, light, and shadow",
    year: "2023",
  },
  {
    id: 8,
    title: "Environmental Portraits",
    image: "/environmental-portrait-photography-natural-setting.jpg",
    description: "People in their natural environments",
    year: "2024",
  },
  {
    id: 9,
    title: "Architectural Details",
    image: "/architectural-photography-building-details-black-w.jpg",
    description: "Finding beauty in structural elements",
    year: "2023",
  },
  {
    id: 10,
    title: "Candid Moments",
    image: "/candid-street-photography-authentic-moments.jpg",
    description: "Unguarded expressions and genuine emotions",
    year: "2024",
  },
  {
    id: 11,
    title: "Light Studies",
    image: "/artistic-light-photography-shadows-contrast.jpg",
    description: "Exploring the interplay of light and shadow",
    year: "2023",
  },
  {
    id: 12,
    title: "Urban Landscapes",
    image: "/urban-landscape-photography-cityscape-artistic.jpg",
    description: "The city as a living, breathing entity",
    year: "2024",
  },
];

export interface PhotographyImage {
  id: string | number;
  title: string;
  image?: string; // For local images
  publicId?: string; // For Cloudinary images
  version?: number; // Cloudinary version for cache busting
  description: string;
  year: string;
}

export function usePhotographyImages() {
  const [images, setImages] = useState<PhotographyImage[]>(localImages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadImages() {
      if (!CLOUDINARY_CONFIG.USE_CLOUDINARY) {
        // Use local images
        setImages(localImages);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const cloudinaryImages = await fetchCloudinaryImages();
        
        if (cloudinaryImages.length === 0) {
          console.warn("No Cloudinary images found. Check:", {
            USE_CLOUDINARY: CLOUDINARY_CONFIG.USE_CLOUDINARY,
            CLOUD_NAME: CLOUDINARY_CONFIG.CLOUD_NAME,
            FOLDER: CLOUDINARY_CONFIG.FOLDER,
          });
          // Fallback to local images if no Cloudinary images
          setImages(localImages);
          return;
        }

        // Transform Cloudinary images to match our interface
        const transformedImages: PhotographyImage[] = cloudinaryImages.map(
          (img) => ({
            id: img.id,
            title: img.title,
            publicId: img.publicId,
            version: img.version, // Include version for cache busting
            description: img.description,
            year: img.year,
          })
        );

        console.log(`Loaded ${transformedImages.length} images from Cloudinary`);
        setImages(transformedImages);
      } catch (err) {
        setError("Failed to load images");
        console.error("Error loading images:", err);
        // Fallback to local images on error
        setImages(localImages);
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, []);

  // Helper function to get the correct image URL
  const getImageUrl = (
    image: PhotographyImage,
    options?: { width?: number; height?: number }
  ) => {
    if (image.publicId && CLOUDINARY_CONFIG.USE_CLOUDINARY) {
      return getCloudinaryUrl(image.publicId, {
        ...options,
        version: image.version, // Use version for cache busting
      });
    }
    return image.image || "/placeholder.svg";
  };

  return {
    images,
    loading,
    error,
    getImageUrl,
    isUsingCloudinary: CLOUDINARY_CONFIG.USE_CLOUDINARY,
  };
}
