import { NextResponse } from "next/server";
import { CLOUDINARY_CONFIG } from "@/lib/cloudinary";

// Server-side API route to fetch images from Cloudinary
export async function GET() {
  try {
    // Log configuration status for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
      console.log("Cloudinary Config:", {
        USE_CLOUDINARY: CLOUDINARY_CONFIG.USE_CLOUDINARY,
        CLOUD_NAME: CLOUDINARY_CONFIG.CLOUD_NAME ? "***" : "MISSING",
        API_KEY: CLOUDINARY_CONFIG.API_KEY ? "***" : "MISSING",
        API_SECRET: CLOUDINARY_CONFIG.API_SECRET ? "***" : "MISSING",
        FOLDER: CLOUDINARY_CONFIG.FOLDER,
      });
    }

    if (!CLOUDINARY_CONFIG.USE_CLOUDINARY) {
      console.warn("Cloudinary is disabled. Set NEXT_PUBLIC_USE_CLOUDINARY=true");
      return NextResponse.json(
        { images: [], error: "Cloudinary is disabled" },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
          },
        }
      );
    }

    if (!CLOUDINARY_CONFIG.CLOUD_NAME || !CLOUDINARY_CONFIG.API_KEY || !CLOUDINARY_CONFIG.API_SECRET) {
      console.error("Missing Cloudinary credentials:", {
        hasCloudName: !!CLOUDINARY_CONFIG.CLOUD_NAME,
        hasApiKey: !!CLOUDINARY_CONFIG.API_KEY,
        hasApiSecret: !!CLOUDINARY_CONFIG.API_SECRET,
      });
      return NextResponse.json(
        { images: [], error: "Missing Cloudinary credentials" },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
          },
        }
      );
    }

    // Cloudinary Admin API call - disable caching to get fresh data
    // Use type=upload to get all images, then filter by folder
    const folderParam = CLOUDINARY_CONFIG.FOLDER ? `&folder=${encodeURIComponent(CLOUDINARY_CONFIG.FOLDER)}` : '';
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/resources/image?type=upload${folderParam}&max_results=500&context=true`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${CLOUDINARY_CONFIG.API_KEY}:${CLOUDINARY_CONFIG.API_SECRET}`
          ).toString("base64")}`,
        },
        cache: "no-store", // Disable Next.js fetch caching
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Failed to fetch from Cloudinary: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.resources || !Array.isArray(data.resources)) {
      console.error("Invalid Cloudinary response:", data);
      throw new Error("Invalid response from Cloudinary API");
    }

    // Filter images to only include those in the exact folder (not subfolders)
    // This ensures we only get images from the specified folder
    let folderImages = data.resources;
    
    if (CLOUDINARY_CONFIG.FOLDER && CLOUDINARY_CONFIG.FOLDER !== '') {
      const folderPrefix = `${CLOUDINARY_CONFIG.FOLDER}/`;
      folderImages = data.resources.filter((resource: any) => {
        // Ensure the image is in the exact folder, not a subfolder
        return resource.public_id.startsWith(folderPrefix) && 
               !resource.public_id.substring(folderPrefix.length).includes('/');
      });
    } else {
      // If no folder specified, include root-level images (no slashes or single-level)
      folderImages = data.resources.filter((resource: any) => {
        const parts = resource.public_id.split('/');
        return parts.length <= 1; // Root level only
      });
    }

    // Log for debugging
    if (process.env.NODE_ENV === "development") {
      console.log(`Found ${data.resources.length} total images, ${folderImages.length} in folder "${CLOUDINARY_CONFIG.FOLDER || 'root'}"`);
      if (folderImages.length > 0) {
        console.log("Sample public IDs:", folderImages.slice(0, 3).map((r: any) => r.public_id));
      }
    }

    // Transform the response to match our image interface
    // Include version for cache busting
    const images = folderImages.map((resource: any) => ({
      id: resource.asset_id,
      title: resource.context?.title || resource.public_id.split("/").pop()?.replace(/_/g, ' ') || "Untitled",
      description: resource.context?.description || "",
      year: resource.context?.year || new Date().getFullYear().toString(),
      publicId: resource.public_id, // Keep full public_id including folder path
      version: resource.version, // Include version for cache busting
      tags: resource.tags || [],
      width: resource.width,
      height: resource.height,
    }));

    return NextResponse.json(
      { images },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error) {
    console.error("Cloudinary API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }
}
