import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    const folder = process.env.NEXT_CLOUDINARY_FOLDER!; // ✅ FIXED

    // Use Cloudinary Search API — the correct way to filter by folder
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: `folder="${folder}" AND resource_type="image"`, // ✅ FIXED
          max_results: 100,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Cloudinary images");
    }

    const data = await response.json();

    const images = data.resources.map((resource: any) => ({
      id: resource.asset_id,
      publicId: resource.public_id,
      url: resource.secure_url + `?v=${resource.version}`, // cache busting
      width: resource.width,
      height: resource.height,
      format: resource.format,
      folder: resource.folder, // debugging visibility
    }));

    return NextResponse.json(
      { images },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err) {
    console.error("Cloudinary image fetch error:", err);
    return NextResponse.json({ error: "Failed to load images" }, { status: 500 });
  }
}
