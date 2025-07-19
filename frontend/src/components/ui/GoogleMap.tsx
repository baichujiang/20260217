"use client";

import { useEffect, useRef } from "react";

export default function GoogleMap({
                                      destinations,
                                      hotels = [],
                                      zoom = 12,
                                  }: {
    destinations: { name: string; coords: [number, number] }[];
    hotels?: { name: string; coords: [number, number] }[];
    zoom?: number;
}) {
    const mapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!window.google || !destinations.length) return;

        const center = {
            lat: destinations[0].coords[0],
            lng: destinations[0].coords[1],
        };

        const map = new window.google.maps.Map(mapRef.current!, {
            center,
            zoom,
        });

        destinations.forEach((dest) => {
            new window.google.maps.Marker({
                position: { lat: dest.coords[0], lng: dest.coords[1] },
                map,
                title: dest.name,
                icon: {
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                },
            });
        });

        hotels.forEach((hotel) => {
            new window.google.maps.Marker({
                position: { lat: hotel.coords[0], lng: hotel.coords[1] },
                map,
                title: hotel.name,
                icon: {
                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                },
            });
        });
    }, [destinations, hotels, zoom]);

    return (
        <div
            ref={mapRef}
            className="w-full h-96 rounded-lg border overflow-hidden"
        />
    );
}
