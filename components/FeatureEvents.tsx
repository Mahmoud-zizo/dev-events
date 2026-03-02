import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const FeaturedEvents = async () => {
  // Data fetching happens here
  const res = await fetch(`${BASE_URL}/api/events`, {
    next: { revalidate: 3600 }, // Professional tip: cache for 1 hour
  });
  const { events } = await res.json();

  return (
    <ul className="events list-none mt-10">
      {events?.map((event: IEvent) => (
        <li key={event.title}>
          <EventCard {...event} />
        </li>
      ))}
    </ul>
  );
};

export default FeaturedEvents;
