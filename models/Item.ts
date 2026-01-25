import mongoose, { Schema, Document, Model } from "mongoose";

export interface IItem extends Document {
  name: string;
  description: string;
  price: number;
  slug: string;
  media: { type: "image" | "video"; url: string }[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    slug: { type: String, required: true, unique: true },
    media: [{ type: { type: String }, url: { type: String } }],
    category: { type: String, required: true },
  },
  { timestamps: true },
);

export const Item: Model<IItem> =
  mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema);
