import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface representing an Event document in MongoDB.
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    overview: { type: String, required: [true, 'Overview is required'], trim: true },
    image: { type: String, required: [true, 'Image URL is required'], trim: true },
    venue: { type: String, required: [true, 'Venue is required'], trim: true },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    date: { type: String, required: [true, 'Date is required'], trim: true },
    time: { type: String, required: [true, 'Time is required'], trim: true },
    mode: { type: String, required: [true, 'Mode is required'], trim: true },
    audience: { type: String, required: [true, 'Audience is required'], trim: true },
    agenda: { 
      type: [String], 
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Agenda must contain at least one item'
      }
    },
    organizer: { type: String, required: [true, 'Organizer is required'], trim: true },
    tags: { 
      type: [String], 
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Tags must contain at least one item'
      }
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook:
 * 1. Generates URL-friendly slug from title.
 * 2. Validates and normalizes date.
 * 3. Normalizes time format.
 */
EventSchema.pre('save', async function (this: IEvent) {
  // Slug Generation
  if (this.isModified('title')) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    let slug = baseSlug;
    let counter = 1;

    // Check for slug collisions and append numeric suffix if needed
    while (true) {
      const existing = await mongoose.models.Event.findOne({
        slug,
        _id: { $ne: this._id }
      });

      if (!existing) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  // Date Validation and Normalization
  if (this.isModified('date')) {
    // Parse YYYY-MM-DD components explicitly to avoid timezone shifts
    const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = this.date.trim().match(datePattern);

    if (!match) {
      throw new Error('Invalid date format. Please provide a date in YYYY-MM-DD format.');
    }

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);

    // Validate numeric ranges
    if (year < 1000 || year > 9999) {
      throw new Error('Invalid year. Year must be between 1000 and 9999.');
    }
    if (month < 1 || month > 12) {
      throw new Error('Invalid month. Month must be between 01 and 12.');
    }
    if (day < 1 || day > 31) {
      throw new Error('Invalid day. Day must be between 01 and 31.');
    }

    // Construct UTC date to avoid local timezone offsets
    const utcDate = new Date(Date.UTC(year, month - 1, day));
    if (isNaN(utcDate.getTime())) {
      throw new Error('Invalid date. Please provide a valid date.');
    }

    // Assign normalized ISO date string (YYYY-MM-DD)
    this.date = utcDate.toISOString().split('T')[0];
  }

  // Time Normalization
  if (this.isModified('time')) {
    this.time = this.time.trim().toLowerCase();
  }
});

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;