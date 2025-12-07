// /pages/api/cloudinary/[type].ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query; // 'images' or 'videos'

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const folder = process.env.NEXT_CLOUDINARY_FOLDER!;

  // Map plural type to Cloudinary resource_type
  const resourceTypeMap: Record<string, string> = {
    images: "image",
    videos: "video",
  };

  if (!resourceTypeMap[type as string]) {
    return res.status(400).json({ error: "Invalid type" });
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: `resource_type:${resourceTypeMap[type as string]} AND folder:${folder}`,
          max_results: 100,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudinary error:", data);
      return res.status(500).json({ error: "Failed to fetch from Cloudinary" });
    }

    const items = (data.resources || []).map((item: any) => ({
      id: item.asset_id,
      url: item.secure_url,
      publicId: item.public_id,
      width: item.width,
      height: item.height,
      format: item.format,
      folder: item.folder,
    }));

    return res.status(200).json({ items, count: items.length });
  } catch (err: any) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server failed to fetch Cloudinary data" });
  }
}
