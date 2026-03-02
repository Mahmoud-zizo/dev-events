import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import { getSimilarEventsBySlug } from "@/lib/actions/event.action";
import EventCard from "@/components/EventCard";
import DeleteEventButton from "../_components/DeleteButton";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface EventDetailsItemProps {
  icon: string;
  alt: string;
  label: string;
}

const EventDetailsItem = ({ icon, alt, label }: EventDetailsItemProps) => {
  return (
    <div className="flex flex-row gap-2 items-center ">
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  );
};

const AgendaItem = ({ agendaItem }: { agendaItem: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItem.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5">
    {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const req = await fetch(`${BASE_URL}/api/events/${slug}`);

  if (!req.ok) return notFound();
  const {
    event: {
      slug: eventSlug,
      title,
      description,
      image,
      organizer,
      overview,
      audience,
      location,
      date,
      time,
      mode,
      agenda,
      tags,
    },
  } = await req.json();

  const bookings = 10;

  const similarEvent = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>
      <div className="details">
        {/* left side  */}
        <div className="content">
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
            unoptimized
          />
          <section className="flex flex-col gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex flex-col gap-2">
            <h2>Event Details</h2>
            <EventDetailsItem
              icon="/icons/calendar.svg"
              alt="calender"
              label={date}
            />

            <EventDetailsItem
              icon="/icons/clock.svg"
              alt="calender"
              label={time}
            />

            <EventDetailsItem
              icon="/icons/pin.svg"
              alt="calender"
              label={location}
            />

            <EventDetailsItem
              icon="/icons/mode.svg"
              alt="calender"
              label={mode}
            />

            <EventDetailsItem
              icon="/icons/audience.svg"
              alt="calender"
              label={audience}
            />
          </section>

          <AgendaItem agendaItem={agenda} />

          <section className="flex-col gap-2">
            <h2>About the organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>
        {/* right side  */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot Now!</h2>
            {bookings > 0 ? (
              <p>Join {bookings} others who have booked their spot for this</p>
            ) : (
              <p>Be the first to book your spot</p>
            )}
            <BookEvent />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvent.length > 0 &&
            similarEvent.map((event) => (
              <EventCard key={event.title} {...event} />
            ))}
        </div>
      </div>

      <br />
      <DeleteEventButton eventSlug={eventSlug} eventTitle={title} />
    </section>
  );
};

export default EventDetailsPage;
