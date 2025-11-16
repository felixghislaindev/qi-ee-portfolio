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

    // Transform the response to match our video interface
    const videos = data.resources.map((resource: any) => ({
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

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Cloudinary API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

