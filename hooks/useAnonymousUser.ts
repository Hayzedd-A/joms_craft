'use client';

import { useEffect, useState, useCallback } from 'react';

export function useAnonymousUser() {
  const [userId, setUserId] = useState<string>('');

  const initializeUser = useCallback(() => {
    let storedId = localStorage.getItem('anonymousUserId');
    
    if (!storedId) {
      storedId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('anonymousUserId', storedId);
    }

    setUserId(storedId);
  }, []);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return userId;
}

export function useFavourites(userId: string) {
  const [favourites, setFavourites] = useState<Set<string>>(new Set());

  const syncFavourites = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/favourites?userId=${userId}`);
      const data = await response.json();
      
      if (data.favourites) {
        const favouriteIds = new Set(
          data.favourites.map((f: { itemId: { _id: string } }) => f.itemId._id)
        );
        setFavourites(favouriteIds);
      }
    } catch (error) {
      console.error('Error fetching favourites:', error);
    }
  }, [userId]);

  useEffect(() => {
    syncFavourites();
  }, [syncFavourites]);

  const toggleFavourite = async (itemId: string) => {
    try {
      const response = await fetch('/api/favourites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, anonymousUserId: userId }),
      });

      const data = await response.json();

      if (data.favourited) {
        setFavourites((prev) => new Set(prev).add(itemId));
      } else {
        setFavourites((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        }));
      }

      return data.favourited;
    } catch (error) {
      console.error('Error toggling favourite:', error);
      return false;
    }
  };

  return { favourites, toggleFavourite };
}

