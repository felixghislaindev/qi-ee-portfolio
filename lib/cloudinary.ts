// Cloudinary configuration and utilities
export interface CloudinaryImage {
  id: string;
  title: string;
  description: string;
  year: string;
  publicId: string; // Cloudinary public ID
  version?: number; // Cloudinary version for cache busting
  tags?: string[];
  width?: number;
  height?: number;
}

export interface CloudinaryVideo {
  id: string;
  title: string;
  description: string;
  year: string;
  publicId: string; // Cloudinary public ID
  version?: number; // Cloudinary version for cache busting
  tags?: string[];
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
}

// Configuration - set USE_CLOUDINARY to true when ready to use Cloudinary
export const CLOUDINARY_CONFIG = {
  USE_CLOUDINARY: process.env.NEXT_PUBLIC_USE_CLOUDINARY === "true",
  CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET,
  FOLDER: process.env.NEXT_CLOUDINARY_FOLDER || "qi-ee-portfolio-pics",
};

// Generate Cloudinary URL with transformations
export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    crop?: string;
    version?: number; // Version for cache busting
  } = {}
) {
  const {
    width = 800,
    height = 1000,
    quality = "auto",
    format = "auto",
    crop = "fill",
    version,
  } = options;

  // Validate CLOUD_NAME is set
  if (!CLOUDINARY_CONFIG.CLOUD_NAME) {
    console.error("CLOUDINARY_CONFIG.CLOUD_NAME is not set. Cannot generate Cloudinary URL.");
    return "/placeholder.svg";
  }

  // Include version in URL for cache busting
  const versionParam = version ? `v${version}/` : '';
  
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload/${versionParam}w_${width},h_${height},c_${crop},q_${quality},f_${format}/${publicId}`;
}

// Generate Cloudinary video URL with transformations
export function getCloudinaryVideoUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    version?: number; // Version for cache busting
  } = {}
) {
  if (!CLOUDINARY_CONFIG.CLOUD_NAME) {
    // Return a placeholder URL if Cloudinary is not configured
    return `https://res.cloudinary.com/demo/video/upload/${publicId}.mp4`;
  }

  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    version,
  } = options;

  // Include version in URL for cache busting
  const versionParam = version ? `v${version}/` : '';
  
  let url = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/video/upload/${versionParam}`;
  
  const transformations: string[] = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  
  if (transformations.length > 0) {
    url += `${transformations.join(",")}/`;
  }
  
  url += `${publicId}`;
  
  return url;
}

// Fetch images from Cloudinary API
export async function fetchCloudinaryImages(): Promise<CloudinaryImage[]> {
  if (!CLOUDINARY_CONFIG.USE_CLOUDINARY) {
    return [];
  }

  try {
    // Disable caching to ensure fresh data
    const response = await fetch("/api/cloudinary/images", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch images");

    const data = await response.json();
    return data.images || [];
  } catch (error) {
    console.error("Error fetching Cloudinary images:", error);
    return [];
  }
}

// Transform Cloudinary response to our image format
export function transformCloudinaryImage(
  cloudinaryResource: any
): CloudinaryImage {
  return {
    id: cloudinaryResource.asset_id,
    title: cloudinaryResource.context?.title || "Untitled",
    description: cloudinaryResource.context?.description || "",
    year:
      cloudinaryResource.context?.year || new Date().getFullYear().toString(),
    publicId: cloudinaryResource.public_id,
    tags: cloudinaryResource.tags || [],
    width: cloudinaryResource.width,
    height: cloudinaryResource.height,
  };
}

// Fetch videos from Cloudinary API
export async function fetchCloudinaryVideos(): Promise<CloudinaryVideo[]> {
  if (!CLOUDINARY_CONFIG.USE_CLOUDINARY) {
    return [];
  }

  try {
    // Disable caching to ensure fresh data
    const response = await fetch("/api/cloudinary/videos", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch videos");

    const data = await response.json();
    return data.videos || [];
  } catch (error) {
    console.error("Error fetching Cloudinary videos:", error);
    return [];
  }
}
