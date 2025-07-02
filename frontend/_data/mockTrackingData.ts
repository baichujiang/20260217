// frontend/src/data/mockTrackingData.ts

export const mockTrackingData = [
    {
      id: "tracking_001",
      courier: "DHL",
      trackingNumber: "1234567890",
      status: "In Transit",
      checkpoints: [
        { time: "2025-06-28 10:15", location: "Berlin, DE", message: "Departed from facility" },
        { time: "2025-06-29 14:30", location: "Munich, DE", message: "Arrived at distribution center" },
      ],
      lastUpdate: "2025-06-30 08:12",
    },
    {
      id: "tracking_002",
      courier: "Hermes",
      trackingNumber: "0987654321",
      status: "Delivered",
      checkpoints: [
        { time: "2025-06-25 09:00", location: "Stuttgart, DE", message: "Out for delivery" },
        { time: "2025-06-25 12:50", location: "Stuttgart, DE", message: "Delivered to recipient" },
      ],
      lastUpdate: "2025-06-25 13:00",
    },
  ];
  