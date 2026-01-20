import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFavourite extends Document {
  itemId: mongoose.Types.ObjectId;
  anonymousUserId: string;
  createdAt: Date;
}

const FavouriteSchema = new Schema<IFavourite>(
  {
    itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
    anonymousUserId: { type: String, required: true },
  },
  { timestamps: true }
);

FavouriteSchema.index({ itemId: 1, anonymousUserId: 1 }, { unique: true });

export const Favourite: Model<IFavourite> =
  mongoose.models.Favourite || mongoose.model<IFavourite>('Favourite', FavouriteSchema);

