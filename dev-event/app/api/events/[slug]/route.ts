import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Event } from '@/database';

/**
 * Dynamics route parameters in Next.js 15+ are async.
 * We define a type for the params object.
 */
interface Params {
  slug: string;
}

/**
 * GET handler to fetch event details by slug.
 * 
 * @param request The Next.js request object.
 * @param context The route context containing params.
 * @returns A JSON response with event data or error message.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    // Await params object as per Next.js 15 App Router requirements.
    const { slug } = await params;

    // Validate if slug is provided (though normally handled by Next.js dynamic routes).
    if (!slug) {
      return NextResponse.json(
        { message: 'Event slug is required' },
        { status: 400 }
      );
    }

    // Establish a connection to the database.
    await connectToDatabase();

    // Query for the event using its unique slug.
    const event = await Event.findOne({ slug });

    // Handle case where event is not found.
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${slug}' not found` },
        { status: 404 }
      );
    }

    // Return the found event as a JSON response.
    return NextResponse.json({ message: "Event fetched successfully", event }, { status: 200 });
  } catch (error: unknown) {
    // Provide a generic error message if an unexpected failure occurs.
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
