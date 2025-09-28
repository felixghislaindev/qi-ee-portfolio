import { NextResponse } from "next/server"
import { CLOUDINARY_CONFIG } from "@/lib/cloudinary"

// Server-side API route to fetch images from Cloudinary
export async function GET() {
  try {
    if (!CLOUDINARY_CONFIG.USE_CLOUDINARY) {
      return NextResponse.json({ images: [] })
    }

    // Cloudinary Admin API call
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/resources/image?folder=${CLOUDINARY_CONFIG.FOLDER}&max_results=100&context=true`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${CLOUDINARY_CONFIG.API_KEY}:${CLOUDINARY_CONFIG.API_SECRET}`).toString(
            "base64",
          )}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch from Cloudinary")
    }

    const data = await response.json()

    // Transform the response to match our image interface
    const images = data.resources.map((resource: any) => ({
      id: resource.asset_id,
      title: resource.context?.title || resource.public_id.split("/").pop(),
      description: resource.context?.description || "",
      year: resource.context?.year || new Date().getFullYear().toString(),
      publicId: resource.public_id,
      tags: resource.tags || [],
      width: resource.width,
      height: resource.height,
    }))

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Cloudinary API error:", error)
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}
