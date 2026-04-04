import EventDetails from "@/app/components/EventDetails";
import { Suspense } from "react";

const EventDetailsBoundary = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  return <EventDetails slug={slug} />;
};

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <Suspense fallback={<section id="event" />}>
      <EventDetailsBoundary params={params} />
    </Suspense>
  );
};

export default EventDetailsPage