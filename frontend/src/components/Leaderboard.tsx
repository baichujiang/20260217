import React, { useState, useEffect } from 'react';
import Image from "next/image";

interface LeaderboardEntry {
  id: number;
  username: string;
  watering_amount: number;
  avatar_url: string | null;
}

type Period = 'daily' | 'week' | 'total';

export const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [period, setPeriod] = useState<Period>('daily');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/trees/leaderboard?period=${period}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: LeaderboardEntry[] = await res.json();
      setEntries(data);
      console.log("🏁 leaderboard data fetched:", data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Trigger on initial load and when period changes
  }, [period]);

  const renderTabs = () => (
    <div className="flex space-x-4 mb-4">
      {(['daily', 'week', 'total'] as Period[]).map(p => (
        <button
          key={p}
          className={`px-4 py-2 rounded-t-lg ${period === p ? 'border-b-2 border-green-500 font-semibold' : 'text-gray-500'}`}
          onClick={() => setPeriod(p)}
        >
          {p.charAt(0).toUpperCase() + p.slice(1)}
        </button>
      ))}
    </div>
  );

  const renderList = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (entries.length === 0) return <p>No data available</p>;

    return (
      <ol className="divide-y divide-gray-200">
        {entries.map((e, idx) => (
          <li key={e.id} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Image
                src={e.avatar_url || "/avatar-default.svg"}
                alt="Avatar"
                width={32}
                height={32}
                className="rounded-full border"
              />
              <span>#{idx + 1} {e.username}</span>
            </div>
            <span className="font-semibold">{e.watering_amount} pts</span>
          </li>
        ))}
      </ol>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Leaderboard</h2>
        <button
          onClick={fetchData}
          className="p-2 hover:opacity-80"
        >
          <Image
            src="/refresh.png"
            alt="Refresh"
            width={40}
            height={40}
          />
        </button>
      </div>
      {renderTabs()}
      {renderList()}
    </div>
  );
};

export default Leaderboard;
