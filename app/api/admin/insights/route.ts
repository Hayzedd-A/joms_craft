import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Favourite } from '@/models/Favourite';
import { Item } from '@/models/Item';

export async function GET() {
  try {
    await connectToDatabase();

    // Get all favourites
    const favourites = await Favourite.find().lean();

    // Group by anonymous user ID
    const userFavourites: Record<string, string[]> = {};
    favourites.forEach((fav) => {
      const userId = fav.anonymousUserId;
      if (!userFavourites[userId]) {
        userFavourites[userId] = [];
      }
      userFavourites[userId].push(fav.itemId.toString());
    });

    // Count favourites per item
    const itemCounts: Record<string, number> = {};
    favourites.forEach((fav) => {
      const itemId = fav.itemId.toString();
      itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
    });

    // Get item details for the most favourited items
    const mostFavouritedItems = await Item.find({
      _id: { $in: Object.keys(itemCounts) },
    }).lean();

    const enrichedItems = mostFavouritedItems.map((item) => ({
      ...item,
      favouriteCount: itemCounts[item._id.toString()] || 0,
    }));

    // Sort by favourite count
    enrichedItems.sort((a, b) => b.favouriteCount - a.favouriteCount);

    return NextResponse.json({
      userFavourites,
      mostFavouritedItems: enrichedItems,
      totalFavourites: favourites.length,
      totalUniqueUsers: Object.keys(userFavourites).length,
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}

