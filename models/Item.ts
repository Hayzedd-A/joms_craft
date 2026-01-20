import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IItem extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: String, required: true },
  },
  { timestamps: true }
);

export const Item: Model<IItem> =
  mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);

