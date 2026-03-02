import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

// ─── Cloudinary config (REQUIRED — missing in original) ───────────────────────

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();

    // 1. Extract and validate image
    const file = formData.get("image") as File | null;
    if (!file || file.size === 0) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 },
      );
    }

    // 2. Parse tags and agenda from JSON strings
    let tags: string[] = [];
    let agenda: string[] = [];
    try {
      const rawTags = formData.get("tags") as string | null;
      const rawAgenda = formData.get("agenda") as string | null;
      tags = rawTags ? JSON.parse(rawTags) : [];
      agenda = rawAgenda ? JSON.parse(rawAgenda) : [];
    } catch {
      return NextResponse.json(
        { message: "Invalid tags or agenda format" },
        { status: 400 },
      );
    }

    // 3. Upload image to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "image", folder: "Dev Events" },
            (error, result) => {
              if (error || !result)
                return reject(error ?? new Error("Upload failed"));
              resolve(result as { secure_url: string });
            },
          )
          .end(buffer);
      },
    );

    // 4. Build event object explicitly — no Object.fromEntries spread
    //    so no stale File object or raw JSON string can sneak into the DB
    const createdEvent = await Event.create({
      title: (formData.get("title") as string).trim(),
      overview: (formData.get("overview") as string).trim(),
      description: (formData.get("description") as string).trim(),
      organizer: (formData.get("organizer") as string).trim(),
      venue: (formData.get("venue") as string).trim(),
      location: (formData.get("location") as string).trim(),
      audience: (formData.get("audience") as string).trim(),
      mode: (formData.get("mode") as string).trim(),
      date: (formData.get("date") as string).trim(),
      time: (formData.get("time") as string).trim(),
      image: uploadResult.secure_url,
      tags,
      agenda,
    });
    // Revalidate pages that display events lists
    revalidatePath("/"); // Homepage
    revalidatePath("/events"); // Events listing page (if it exists)
    return NextResponse.json(
      { message: "Event Created Successfully", event: createdEvent },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/events]", err);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: err instanceof Error ? err.message : "Unknown Error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { message: "Events Fetched Successfully", events },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Event Fetching Failed", error: err },
      { status: 500 },
    );
  }
}
