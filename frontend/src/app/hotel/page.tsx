"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import GoogleMap from "@/components/ui/GoogleMap";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HotelPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [places, setPlaces] = useState<string[]>([""]);
  const [popoverStates, setPopoverStates] = useState<boolean[]>([false]);
  const [error, setError] = useState<string | null>(null);
  const [randomTimes, setRandomTimes] = useState<Record<string, Record<string, number>>>({});

  const allDestinations = [
    "Marienplatz",
    "TUM Garching",
    "English Garden",
    "Nymphenburg Palace",
    "Deutsches Museum",
    "Olympiapark",
    "Viktualienmarkt",
    "BMW Welt",
  ];

  const destinationCoords: Record<string, [number, number]> = {
    "Marienplatz": [48.1374, 11.5755],
    "TUM Garching": [48.2620, 11.6670],
    "English Garden": [48.1640, 11.6033],
    "Nymphenburg Palace": [48.1585, 11.5021],
    "Deutsches Museum": [48.1303, 11.5840],
    "Olympiapark": [48.1741, 11.5463],
    "Viktualienmarkt": [48.1351, 11.5766],
    "BMW Welt": [48.1766, 11.5566],
  };

  const hotels: { name: string; coords: [number, number] }[] = [
    { name: "Hotel Königshof", coords: [48.1391, 11.5658] },
    { name: "NH Collection München", coords: [48.1366, 11.5720] },
    { name: "Leonardo Royal Hotel", coords: [48.1790, 11.5530] },
    { name: "Holiday Inn Munich City Centre", coords: [48.1290, 11.5940] },
    { name: "Motel One München-Deutsches Museum", coords: [48.1260, 11.5840] },
    { name: "Hilton Munich Park", coords: [48.1570, 11.5980] },
    { name: "Pullman Munich", coords: [48.1650, 11.5900] },
  ];

  const addPlace = () => {
    setPlaces([...places, ""]);
    setPopoverStates([...popoverStates, false]);
  };

  const removePlace = (idx: number) => {
    if (places.length <= 1) return;
    setPlaces(places.filter((_, i) => i !== idx));
    setPopoverStates(popoverStates.filter((_, i) => i !== idx));
  };

  const selectedDestinations = places
    .filter((p) => p.trim() !== "")
    .map((p) => {
      const key = Object.keys(destinationCoords).find(
        (k) => k.toLowerCase() === p.trim().toLowerCase()
      );
      return key ? { name: key, coords: destinationCoords[key] } : null;
    })
    .filter((d): d is { name: string; coords: [number, number] } => !!d);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Hotels in Munich</h1>

        {step === 1 && (
          <div className="bg-white border rounded-lg p-6 space-y-4 shadow">
            <h2 className="text-lg font-semibold text-gray-800">Select Destinations</h2>
            <div className="space-y-4 relative">
              {places.map((place, idx) => (
                <div key={idx} className="relative flex items-center gap-2">
                  <button
                    disabled={places.length <= 1}
                    onClick={() => removePlace(idx)}
                    className="text-gray-500 hover:text-red-500 text-lg font-bold px-2"
                    type="button"
                  >
                    −
                  </button>

                  <Popover
                    open={popoverStates[idx]}
                    onOpenChange={(v) => {
                      const newStates = [...popoverStates];
                      newStates[idx] = v;
                      setPopoverStates(newStates);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-74 justify-between">
                        {place || "Select destination..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search destination..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No match found.</CommandEmpty>
                          <CommandGroup>
                            {allDestinations.map((dest) => (
                              <CommandItem
                                key={dest}
                                onSelect={() => {
                                  const newPlaces = [...places];
                                  newPlaces[idx] = dest;
                                  setPlaces(newPlaces);
                                  const newStates = [...popoverStates];
                                  newStates[idx] = false;
                                  setPopoverStates(newStates);
                                }}
                              >
                                {dest}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    places[idx] === dest ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={addPlace}>
                + Add destination
              </Button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              onClick={() => {
                const filled = places.filter((p) => p.trim() !== "");
                if (filled.length < 1) {
                  setError("Please enter at least 1 destination.");
                  return;
                }
                setError(null);
                setStep(2);
              }}
              className="w-full mt-2"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white border rounded-lg p-6 space-y-4 shadow">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Destinations</h2>
            <ul className="list-disc pl-5 text-gray-700">
              {selectedDestinations.map((d, idx) => (
                <li key={idx}>{d.name}</li>
              ))}
            </ul>
            <GoogleMap destinations={selectedDestinations} hotels={[]} zoom={13} />
            <Button
              onClick={() => {
                const times: Record<string, Record<string, number>> = {};
                hotels.forEach((hotel) => {
                  times[hotel.name] = {};
                  selectedDestinations.forEach((dest) => {
                    times[hotel.name][dest.name] = Math.floor(Math.random() * 21) + 5;
                  });
                });
                setRandomTimes(times);
                setStep(3);
              }}
              className="w-full"
            >
              Show Recommendations
            </Button>
          </div>
        )}

        <AnimatePresence>
          {step === 3 && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-4"
            >
              <div className="bg-white border rounded-lg p-6 shadow space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Recommended Hotels</h2>
                <GoogleMap destinations={selectedDestinations} hotels={hotels} zoom={13} />
                <div className="grid gap-4">
                  {hotels.map((hotel, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:shadow transition bg-gray-50">
                      <h3 className="font-medium text-gray-800">{hotel.name}</h3>
                      <ul className="text-sm text-gray-500 mt-2 space-y-1">
                        {selectedDestinations.map((dest, destIdx) => {
                          const minutes =
                            randomTimes[hotel.name]?.[dest.name] ?? Math.floor(Math.random() * 21) + 5;
                          return (
                            <li key={destIdx}>
                              ~{minutes} min to {dest.name}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => {
                    setStep(1);
                    setPlaces([""]);
                    setPopoverStates([false]);
                    setRandomTimes({});
                  }}
                  className="w-full"
                >
                  Start Over
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}