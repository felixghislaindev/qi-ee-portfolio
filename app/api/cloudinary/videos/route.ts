import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("=== 🔥 VERCEL ENV VARIABLES CHECK 🔥 ===");

    // ✅ Print server-side env variables
    console.log("NEXT_CLOUDINARY_FOLDER:", process.env.NEXT_CLOUDINARY_FOLDER);
    console.log(
      "CLOUDINARY_API_SECRET (exists?):",
      process.env.CLOUDINARY_API_SECRET ? "YES" : "NO"
    );

    // ✅ Print client-accessible env variables
    console.log(
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:",
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    );
    console.log(
      "NEXT_PUBLIC_CLOUDINARY_API_KEY:",
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
    );
    console.log(
      "NEXT_PUBLIC_USE_CLOUDINARY:",
      process.env.NEXT_PUBLIC_USE_CLOUDINARY
    );

    // Actual Cloudinary fetch
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    const folder = process.env.NEXT_CLOUDINARY_FOLDER!;

    console.log("=== 🔎 SEARCHING CLOUDINARY FOLDER ===");
    console.log('Folder being searched:', folder);

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
          expression: `folder="${folder}" AND resource_type="image"`,
          max_results: 100,
        }),
        cache: "no-store",
      }
    );

    console.log("=== 🔥 CLOUDINARY RESPONSE STATUS ===", response.status);
    const rawText = await response.text();
    console.log("=== RAW RESPONSE TEXT ===");
    console.log(rawText);

    if (!response.ok) {
      throw new Error("Cloudinary API returned error: " + rawText);
    }

    const data = JSON.parse(rawText);

    console.log("=== NUMBER OF RESOURCES FOUND ===", data.resources?.length || 0);

    const images = data.resources.map((resource: any) => ({
      id: resource.asset_id,
      publicId: resource.public_id,
      url: resource.secure_url + `?v=${resource.version}`,
      width: resource.width,
      height: resource.height,
      format: resource.format,
      folder: resource.folder,
    }));

    console.log("=== IMAGES READY TO RETURN ===", images);

    return NextResponse.json(
      { images },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err: any) {
    console.error("=== ❌ CLOUDINARY FETCH ERROR ===");
    console.error(err.stack || err);

    return NextResponse.json({ error: "Failed to load images" }, { status: 500 });
  }
}
 