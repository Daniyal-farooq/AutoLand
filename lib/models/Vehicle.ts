import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  name: string;
  brand: string;
  model: string;
  category: 'sports' | 'luxury' | 'suv' | 'convertible' | 'exotic';
  year: number;
  price: number;
  image: string;
  cloudinaryId: string;
  description: string;
  specifications: {
    engine: string;
    horsepower: number;
    topSpeed: number;
    acceleration: string;
    transmission: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a vehicle name'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please provide a brand'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Please provide a model'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['sports', 'luxury', 'suv', 'convertible', 'exotic'],
      required: [true, 'Please select a category'],
    },
    year: {
      type: Number,
      required: [true, 'Please provide a year'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    cloudinaryId: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    specifications: {
      engine: String,
      horsepower: Number,
      topSpeed: Number,
      acceleration: String,
      transmission: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);
