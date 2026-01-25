import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Item } from "@/models/Item";
import { generateSlug } from "@/lib/util";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const query = category && category !== "all" ? { category } : {};
    const items = await Item.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { name, description = "all", price, media, category } = body;

    if (!name || price === undefined || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    let slug;
    let exists = true;

    while (exists) {
      slug = generateSlug(name);
      let existed = await Item.findOne({ where: { slug } });
      exists = !!existed;
    }

    const item = await Item.create({
      name,
      description: description,
      price,
      slug,
      media: media || [],
      category,
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 },
    );
  }
}
