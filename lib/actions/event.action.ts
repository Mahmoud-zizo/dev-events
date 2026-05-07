"use server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectDB();
    const event = await Event.findOne({ slug });
    if (!event) {
      return [];
    }
    return await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean();
  } catch {
    return [];
  }
};

export const getAllEvents = async () => {
  try {
    await connectDB();
    // Use .lean() to get plain JS objects (required for Server Components)
    // and .sort() to keep your UI consistent
    const events = await Event.find({}).sort({ createdAt: -1 }).lean();

    // We stringify and parse to handle MongoDB ObjectIDs and Date objects
    // which can sometimes cause serialization errors in Next.js
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
};
