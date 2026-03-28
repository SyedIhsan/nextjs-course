import mongoose, { Schema, Document, Model, Types, HydratedDocument } from 'mongoose';
import Event from './event.model';

/**
 * Interface representing a Booking document.
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook:
 * 1. Verifies that the referenced Event exists.
 */
BookingSchema.pre('save', async function (this: HydratedDocument<IBooking>) {
  if (this.isModified('eventId')) {
    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      throw new Error(`Event with ID ${this.eventId} does not exist.`);
    }
  }
});

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;