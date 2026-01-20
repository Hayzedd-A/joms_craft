import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Favourite } from '@/models/Favourite';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const favourites = await Favourite.find({ anonymousUserId: userId })
      .populate('itemId')
      .lean();

    return NextResponse.json({ favourites });
  } catch (error) {
    console.error('Error fetching favourites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favourites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { itemId, anonymousUserId } = body;

    if (!itemId || !anonymousUserId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if already favourited
    const existing = await Favourite.findOne({
      itemId,
      anonymousUserId,
    });

    if (existing) {
      // Remove from favourites (toggle)
      await Favourite.findByIdAndDelete(existing._id);
      return NextResponse.json({ favourited: false, message: 'Removed from favourites' });
    }

    const favourite = await Favourite.create({
      itemId,
      anonymousUserId,
    });

    await favourite.populate('itemId');

    return NextResponse.json({ favourited: true, favourite });
  } catch (error) {
    console.error('Error toggling favourite:', error);
    return NextResponse.json(
      { error: 'Failed to toggle favourite' },
      { status: 500 }
    );
  }
}

