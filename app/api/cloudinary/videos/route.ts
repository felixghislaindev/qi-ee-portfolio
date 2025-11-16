import { NextResponse } from "next/server";
import { CLOUDINARY_CONFIG } from "@/lib/cloudinary";

// Server-side API route to fetch videos from Cloudinary
export async function GET() {
  try {
    if (!CLOUDINARY_CONFIG.USE_CLOUDINARY) {
      return NextResponse.json({ videos: [] });
    }

    // Cloudinary Admin API call for videos
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/resources/video?folder=${CLOUDINARY_CONFIG.FOLDER}&max_results=100&context=true`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${CLOUDINARY_CONFIG.API_KEY}:${CLOUDINARY_CONFIG.API_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from Cloudinary");
    }

    const data = await response.json();

    // Filter videos to only include those in the exact folder (not subfolders)
    const folderPrefix = `${CLOUDINARY_CONFIG.FOLDER}/`;
    const folderVideos = data.resources.filter((resource: any) => {
      // Ensure the video is in the exact folder, not a subfolder
      return resource.public_id.startsWith(folderPrefix) && 
             !resource.public_id.substring(folderPrefix.length).includes('/');
    });

    // Transform the response to match our video interface
    const allVideos = folderVideos.map((resource: any) => ({
      id: resource.asset_id,
      title: resource.context?.title || resource.public_id.split("/").pop(),
      description: resource.context?.description || "",
      year: resource.context?.year || new Date().getFullYear().toString(),
      publicId: resource.public_id,
      tags: resource.tags || [],
      width: resource.width,
      height: resource.height,
      duration: resource.duration,
      format: resource.format,
    }));

    // Deduplicate videos by publicId using a Set
    const seenPublicIds = new Set<string>();
    const uniqueVideos = allVideos.filter((video: any) => {
      if (seenPublicIds.has(video.publicId)) {
        return false;
      }
      seenPublicIds.add(video.publicId);
      return true;
    });

    // Limit to exactly 2 videos (first two in order)
    const limitedVideos = uniqueVideos.slice(0, 2);

    return NextResponse.json({ videos: limitedVideos });
  } catch (error) {
    console.error("Cloudinary API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

