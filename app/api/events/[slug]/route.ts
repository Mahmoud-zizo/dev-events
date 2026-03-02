import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

// Define route params type for type safety
type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * GET /api/events/[slug]
 * Fetches a single events by its slug
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    // Connect to database
    await connectDB();

    // Await and extract slug from params
    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "Invalid or missing slug parameter" },
        { status: 400 },
      );
    }

    // Sanitize slug (remove any potential malicious input)
    const sanitizedSlug = slug.trim().toLowerCase();

    // Query events by slug
    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    // Handle events not found
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${sanitizedSlug}' not found` },
        { status: 404 },
      );
    }

    // Return successful response with events data
    return NextResponse.json(
      { message: "Event fetched successfully", event },
      { status: 200 },
    );
  } catch (error) {
    // Log error  for debugging (only in development)
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching events by slug:", error);
    }

    // Handle specific error types
    if (error instanceof Error) {
      // Handle database connection errors
      if (error.message.includes("MONGODB_URI")) {
        return NextResponse.json(
          { message: "Database configuration error" },
          { status: 500 },
        );
      }

      // Return generic error with error message
      return NextResponse.json(
        { message: "Failed to fetch events", error: error.message },
        { status: 500 },
      );
    }

    // Handle unknown errors
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

// DELETE /api/events/[slug] - Delete event by slug
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug || !slug.trim()) {
      return NextResponse.json(
        { message: "Invalid event slug" },
        { status: 400 },
      );
    }

    await connectDB();

    // Find and delete the event by slug
    const deletedEvent = await Event.findOneAndDelete({ slug });

    if (!deletedEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Revalidate pages that display events
    revalidatePath("/");
    revalidatePath("/events");

    return NextResponse.json(
      {
        message: "Event deleted successfully",
        event: deletedEvent,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[DELETE /api/events/[slug]]", error);

    return NextResponse.json(
      { message: "Failed to delete event" },
      { status: 500 },
    );
  }
}
