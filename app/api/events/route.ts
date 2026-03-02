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

// Increase timeout for Vercel (max 60s on hobby plan)
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    // Validate Cloudinary config first
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("[POST /api/events] Missing Cloudinary credentials");
      return NextResponse.json(
        {
          message: "Server configuration error: Cloudinary credentials not set",
          error: "CLOUDINARY_CONFIG_MISSING",
        },
        { status: 500 },
      );
    }

    // Validate MongoDB config
    if (!process.env.MONGODB_URI) {
      console.error("[POST /api/events] Missing MongoDB URI");
      return NextResponse.json(
        {
          message: "Server configuration error: Database credentials not set",
          error: "MONGODB_URI_MISSING",
        },
        { status: 500 },
      );
    }

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

    // Check file size (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          message: `Image too large. Maximum size is ${MAX_SIZE / 1024 / 1024}MB`,
        },
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

    // 3. Upload image to Cloudinary with timeout
    console.log(
      "[POST /api/events] Starting Cloudinary upload, file size:",
      file.size,
    );
    const buffer = Buffer.from(await file.arrayBuffer());

    let uploadResult;
    try {
      uploadResult = (await Promise.race([
        new Promise<{ secure_url: string }>((resolve, reject) => {
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
        }),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Cloudinary upload timeout (30s)")),
            30000,
          ),
        ),
      ])) as { secure_url: string };

      console.log("[POST /api/events] Cloudinary upload successful");
    } catch (err) {
      console.error("[POST /api/events] Cloudinary upload failed:", err);
      return NextResponse.json(
        {
          message:
            "Image upload failed. Please try a smaller image or try again later.",
          error: err instanceof Error ? err.message : "Unknown error",
        },
        { status: 500 },
      );
    }

    // 4. Build event object explicitly
    console.log("[POST /api/events] Creating event in database");
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

    console.log(
      "[POST /api/events] Event created successfully:",
      createdEvent.slug,
    );

    // Revalidate pages that display events lists
    revalidatePath("/");
    revalidatePath("/events");

    return NextResponse.json(
      { message: "Event Created Successfully", event: createdEvent },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/events] Error:", err);

    // Log full error details for debugging
    if (err instanceof Error) {
      console.error("[POST /api/events] Error name:", err.name);
      console.error("[POST /api/events] Error message:", err.message);
      console.error("[POST /api/events] Error stack:", err.stack);
    }

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
    console.error("[GET /api/events] Error:", err);
    return NextResponse.json(
      { message: "Event Fetching Failed", error: err },
      { status: 500 },
    );
  }
}
