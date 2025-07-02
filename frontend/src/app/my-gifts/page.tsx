'use client';

import React, { useEffect, useState } from 'react';

type Gift = {
  id: number;
  name: string;
  image_src: string;
  description: string;
  claimed_at: string;
};

export default function MyGiftsPage() {
  const [gifts, setGifts] = useState<Gift[]>([]);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const res = await fetch('/api/gifts', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setGifts(data);
      } catch (err) {
        console.error('Failed to fetch gifts', err);
      }
    };

    fetchGifts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎁 我的礼物</h1>
      {gifts.length === 0 ? (
        <p>你还没有领取任何礼物。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gifts.map((gift) => (
            <div key={gift.id} className="border rounded-xl shadow p-4">
              <img src={gift.image_src} alt={gift.name} className="w-full h-40 object-cover rounded" />
              <h2 className="text-xl font-semibold mt-2">{gift.name}</h2>
              <p className="text-sm text-gray-600">{gift.description}</p>
              <p className="text-xs text-gray-400 mt-2">领取时间：{new Date(gift.claimed_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
