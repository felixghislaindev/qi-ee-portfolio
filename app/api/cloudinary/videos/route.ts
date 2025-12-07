// /pages/api/cloudinary/[type].ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query; // 'images' or 'videos'
  const folder = process.env.NEXT_CLOUDINARY_FOLDER; // optional folder filter

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;

  const resourceTypeMap: Record<string, string> = {
    images: "image",
    videos: "video",
  };

  const resourceType = resourceTypeMap[type as string];
  if (!resourceType) return res.status(400).json({ error: "Invalid type" });

  try {
    let allItems: any[] = [];
    let nextCursor: string | undefined = undefined;

    do {
      const body: any = {
        expression: `resource_type:${resourceType}`,
        max_results: 500,
      };

      if (folder) body.expression += ` AND folder:${folder}`;
      if (nextCursor) body.next_cursor = nextCursor;

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      // Log the raw Cloudinary response
      console.log("Raw Cloudinary response:", data);

      if (!response.ok) {
        console.error("Cloudinary error:", data);
        return res.status(500).json({ error: "Failed to fetch from Cloudinary" });
      }

      const items = (data.resources || []).map((item: any) => ({
        url: item.secure_url,
        publicId: item.public_id,
        folder: item.folder,
        width: item.width,
        height: item.height,
        format: item.format,
      }));

      allItems = [...allItems, ...items];
      nextCursor = data.next_cursor;
    } while (nextCursor);

    // Log the final response data before returning
    console.log("Final API response items:", allItems);

    return res.status(200).json({ items: allItems, count: allItems.length });
  } catch (err: any) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server failed to fetch Cloudinary data" });
  }
}
