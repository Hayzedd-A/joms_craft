import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];
    console.log("Received files:", files);
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    let Urls = [];
    const base64Array = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
      base64Array.push(base64);
    }

    const result = await Promise.all(
      base64Array.map((base64) => uploadImage(base64)),
    );
    Urls = result.filter(res => res.success).map((url) => ({url: url.url}));

    return NextResponse.json({ data: Urls }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
