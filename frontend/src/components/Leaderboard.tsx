import React, { useState, useEffect } from 'react';

// 排行榜条目类型
interface LeaderboardEntry {
  user_id: number;
  points: number;
}

type Period = 'daily' | 'week' | 'total';

export const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [period, setPeriod] = useState<Period>('daily');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 当 period 变化时，拉取对应排行榜数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8000/watering/leaderboard?period=${period}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: LeaderboardEntry[] = await res.json();
        setEntries(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  // 渲染顶部标签选择
  const renderTabs = () => (
    <div className="flex space-x-4 mb-4">
      <button
        className={`px-4 py-2 rounded-t-lg ${period === 'daily' ? 'border-b-2 border-green-500 font-semibold' : 'text-gray-500'}`}
        onClick={() => setPeriod('daily')}
      >
        Daily
      </button>
      <button
        className={`px-4 py-2 rounded-t-lg ${period === 'week' ? 'border-b-2 border-green-500 font-semibold' : 'text-gray-500'}`}
        onClick={() => setPeriod('week')}
      >
        Week
      </button>
      <button
        className={`px-4 py-2 rounded-t-lg ${period === 'total' ? 'border-b-2 border-green-500 font-semibold' : 'text-gray-500'}`}
        onClick={() => setPeriod('total')}
      >
        Total
      </button>
    </div>
  );

  // 渲染排行榜列表
  const renderList = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (entries.length === 0) return <p>暂无数据</p>;

    return (
      <ol className="divide-y divide-gray-200">
        {entries.map((e, idx) => (
          <li key={e.user_id} className="flex justify-between py-2">
            <span>#{idx + 1}  {e.username}</span>
            <span className="font-semibold">{e.watering_amount} pts</span>
          </li>
        ))}
      </ol>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
      {renderTabs()}
      {renderList()}
    </div>
  );
};

export default Leaderboard;
