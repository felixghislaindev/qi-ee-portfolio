import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const apiKey = process.env.CLOUDINARY_API_KEY!; // server-only
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    const folder = process.env.NEXT_CLOUDINARY_FOLDER!;

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
          expression: `resource_type:image AND folder="${folder}"`,
          max_results: 100,
        }),
      }
    );

    const data = await response.json();
    console.log("Cloudinary API response:", data);

    if (!response.ok) {
      throw new Error("Cloudinary API error: " + JSON.stringify(data));
    }

    const images = (data.resources || []).map((res: any) => ({
      id: res.asset_id,
      publicId: res.public_id,
      url: res.secure_url + `?v=${res.version}`,
      width: res.width,
      height: res.height,
      format: res.format,
      folder: res.folder,
    }));

    return NextResponse.json(
      { images, imagesCount: images.length },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) {
    console.error("Cloudinary fetch error:", err);
    return NextResponse.json(
      { error: "Failed to load images", hasError: true },
      { status: 500 }
    );
  }
}
