import BookEvent from "@/app/components/BookEvent";
import EventCard from "@/app/components/EventCard";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { getBaseUrlCandidates } from "@/lib/base-url";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";

const BASE_URL_CANDIDATES = getBaseUrlCandidates();

const EventDetailItem = ({ icon, alt, label }: { icon: string; alt: string; label: string }) => (
  <div className="flex-row-gap-2 items-center">
    <Image
      src={icon}
      alt={alt}
      width={17}
      height={17}
    />
    <p>{label}</p>
  </div>
)

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
)

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>{tag}</div>
    ))}
  </div>
)

const EventUnavailable = () => (
  <section className="mx-auto flex max-w-2xl flex-col items-center gap-4 py-24 text-center">
    <h1>Event not available</h1>
    <p className="text-sm opacity-80">
      This event could not be loaded right now. It may have been removed or is not available in the current deployment.
    </p>
    <Link href="/" className="button-submit w-fit">
      Back to home
    </Link>
  </section>
)

const EventDetails = async ({ slug }: { slug: string }) => {
  "use cache";
  cacheLife("hours");

  let event: any = null;

  for (const baseUrl of BASE_URL_CANDIDATES) {
    try {
      const request = await fetch(`${baseUrl}/api/events/${slug}`, {
        headers: { Accept: "application/json" },
      });

      const contentType = request.headers.get("content-type") || "";
      if (!request.ok || !contentType.includes("application/json")) {
        continue;
      }

      const data = await request.json();
      event = data?.event ?? null;
      break;
    } catch {
      continue;
    }
  }

  if (!event) return <EventUnavailable />;

  const {
    _id,
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizer,
  } = event;
  const eventId: string = String(_id);

  if (!description) return <EventUnavailable />;

  const bookings = 10;

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  console.log(similarEvents);

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        {/* Left Side - Event Content */}
        <div className="content">
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>

            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />
            <EventDetailItem
              icon="/icons/clock.svg"
              alt="time"
              label={time}
            />
            <EventDetailItem
              icon="/icons/pin.svg"
              alt="location"
              label={location}
            />
            <EventDetailItem
              icon="/icons/mode.svg"
              alt="mode"
              label={mode}
            />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>

          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        {/* Right Side - Booking Form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">
                Be the first to book your spot!
              </p>
            )}

            <BookEvent eventId={eventId} slug={slug} />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
            <EventCard key={similarEvent.title} {...similarEvent} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EventDetails;