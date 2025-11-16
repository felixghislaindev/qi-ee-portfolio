// Cloudinary configuration and utilities
export interface CloudinaryImage {
  id: string;
  title: string;
  description: string;
  year: string;
  publicId: string; // Cloudinary public ID
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
  } = {}
) {
  const {
    width = 800,
    height = 1000,
    quality = "auto",
    format = "auto",
    crop = "fill",
  } = options;

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload/w_${width},h_${height},c_${crop},q_${quality},f_${format}/${publicId}`;
}

// Generate Cloudinary video URL with transformations
export function getCloudinaryVideoUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
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
  } = options;

  let url = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/video/upload`;
  
  const transformations: string[] = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  
  if (transformations.length > 0) {
    url += `/${transformations.join(",")}`;
  }
  
  url += `/${publicId}`;
  
  return url;
}

// Fetch images from Cloudinary API
export async function fetchCloudinaryImages(): Promise<CloudinaryImage[]> {
  if (!CLOUDINARY_CONFIG.USE_CLOUDINARY) {
    return [];
  }

  try {
    // This would be your server-side API call to Cloudinary
    const response = await fetch("/api/cloudinary/images");
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
    // This would be your server-side API call to Cloudinary
    const response = await fetch("/api/cloudinary/videos");
    if (!response.ok) throw new Error("Failed to fetch videos");

    const data = await response.json();
    return data.videos || [];
  } catch (error) {
    console.error("Error fetching Cloudinary videos:", error);
    return [];
  }
}
