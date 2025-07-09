// frontend/src/app/tracking/page.tsx
"use client";

import { mockTrackingData } from "../../../_data/mockTrackingData";

export default function TrackingPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 我的物流</h1>
      {mockTrackingData.map((item) => (
        <div key={item.id} className="mb-6 p-4 border rounded-xl shadow">
          <div className="font-semibold">{item.courier} · 运单号：{item.trackingNumber}</div>
          <div className="text-sm text-gray-600 mb-2">当前状态：{item.status}</div>
          <ul className="text-sm space-y-1">
            {item.checkpoints.map((cp, idx) => (
              <li key={idx}>
                <span className="font-mono">{cp.time}</span> - <strong>{cp.location}</strong>: {cp.message}
              </li>
            ))}
          </ul>
          <div className="text-xs text-gray-400 mt-2">最后更新：{item.lastUpdate}</div>
        </div>
      ))}
    </div>
  );
}
