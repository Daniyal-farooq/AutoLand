import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryItem extends Document {
  title: string;
  description: string;
  image: string;
  cloudinaryId: string;
  brand: string;
  specs: string;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    cloudinaryId: {
      type: String,
      default: '',
    },
    brand: {
      type: String,
      required: [true, 'Please provide a brand'],
      trim: true,
    },
    specs: {
      type: String,
      required: [true, 'Please provide specifications'],
    },
  },
  { timestamps: true }
);

export default mongoose.models.GalleryItem ||
  mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);
