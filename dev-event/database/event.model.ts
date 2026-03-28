import mongoose, { Schema, Document, Model, HydratedDocument } from 'mongoose';

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
 * 1. Generates URL-friendly unique slug from title.
 * 2. Validates and normalizes date using UTC to avoid timezone shifts.
 * 3. Validates and normalizes time format.
 */
EventSchema.pre('save', async function (this: HydratedDocument<IEvent>) {
  // Slug Generation with uniqueness check
  if (this.isModified('title')) {
    let baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    let slug = baseSlug;
    let counter = 1;
    
    // Check for collisions and append suffix if necessary
    while (await (this.constructor as Model<IEvent>).exists({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }

  // Date Validation and Normalization (UTC-safe)
  if (this.isModified('date')) {
    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = this.date.match(dateRegex);
    
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const day = parseInt(match[3], 10);
      
      // Basic range validation
      if (month < 1 || month > 12 || day < 1 || day > 31) {
        throw new Error('Invalid date components. Please provide a valid YYYY-MM-DD date.');
      }
      
      // Construct UTC date to verify it's a valid calendar date
      const utcDate = new Date(Date.UTC(year, month - 1, day));
      if (utcDate.getUTCFullYear() !== year || utcDate.getUTCMonth() !== month - 1 || utcDate.getUTCDate() !== day) {
        throw new Error('Invalid calendar date provided.');
      }
      
      this.date = utcDate.toISOString().split('T')[0];
    } else {
      // Fallback to standard parsing if not already YYYY-MM-DD, but still UTC-safe
      const parsedDate = new Date(this.date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format. Please provide a valid date string.');
      }
      this.date = parsedDate.toISOString().split('T')[0];
    }
  }

  // Time Normalization and Validation
  if (this.isModified('time')) {
    const timeValue = this.time.trim().toLowerCase();
    // Regex for 24h "HH:MM" or 12h with am/pm "h:mm am"
    const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)$|^([1-9]|1[0-2]):([0-5]\d)\s?(am|pm)$/i;
    
    if (!timeRegex.test(timeValue)) {
      throw new Error('Invalid time format. Use HH:MM or h:mm AM/PM.');
    }
    this.time = timeValue;
  }
});

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
