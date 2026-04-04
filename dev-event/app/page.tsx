import { IEvent } from "@/database";
import EventCard from "./components/EventCard";
import ExploreBtn from "./components/ExploreBtn";
import { cacheLife } from "next/cache";
import { getBaseUrl } from "@/lib/base-url";

const BASE_URL = getBaseUrl();

const Page = async () => {
  "use cache";
  cacheLife("hours")

  let events: IEvent[] = [];

  try {
    const response = await fetch(`${BASE_URL}/api/events`, {
      headers: { Accept: "application/json" },
    });

    const contentType = response.headers.get("content-type") || "";
    if (!response.ok || !contentType.includes("application/json")) {
      throw new Error(`Invalid events response: ${response.status}`);
    }

    const data = await response.json();
    events = Array.isArray(data?.events) ? data.events : [];
  } catch (error) {
    console.error("Failed to fetch events", error);
  }

  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev <br /> Event You Can't Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events list-none">
          {events && events.length > 0 && events.map((event: IEvent) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Page