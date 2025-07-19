"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Pencil, Trophy, Flame, Award, Calendar } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

type UserProfile = {
  id: number;
  username: string;
  avatar_url: string | null;
  total_points: number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProfilePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [originalAvatar, setOriginalAvatar] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  const avatarUrls = Array.from({ length: 20 }, (_, i) => `/avatars/avatar${i + 1}.jpeg`);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchProfile = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        router.push("/account");
        return;
      }

      setToken(storedToken);

      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data: UserProfile = await response.json();
        setProfile(data);
        setSelectedAvatar(data.avatar_url || null);
        setOriginalAvatar(data.avatar_url || null);

        if (data.avatar_url) {
          localStorage.setItem("selectedAvatar", data.avatar_url);
        } else {
          localStorage.removeItem("selectedAvatar");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        localStorage.removeItem("token");
        router.push("/account");
      } finally {
        setLoading(false);
      }
    };

    const checkCheckInStatus = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) return;

      try {
        const res = await fetch(`${API_BASE_URL}/checkin/status`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        const data = await res.json();
        setHasCheckedInToday(data.checked_in);
        setCurrentStreak(data.current_streak);
      } catch (err) {
        console.error("Failed to fetch check-in status:", err);
      }
    };

    fetchProfile();
    checkCheckInStatus();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedAvatar");
    router.push("/account");
  };

  const handleSaveAvatar = async () => {
    if (!selectedAvatar || !token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/avatar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar_url: selectedAvatar }),
      });

      if (!response.ok) throw new Error("Failed to save avatar");

      localStorage.setItem("selectedAvatar", selectedAvatar);
      setOriginalAvatar(selectedAvatar);
      setShowSelector(false);
      toast.success("New avatar saved.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save.");
    }
  };

  const handleDailyCheckIn = async () => {
    if (!token) return;
    setCheckInLoading(true);

    try {
      const statusRes = await fetch(`${API_BASE_URL}/checkin/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const statusData = await statusRes.json();
      if (statusData.checked_in) {
        setHasCheckedInToday(true);
        toast.info("Already checked in today.");
        return;
      }

      const checkinRes = await fetch(`${API_BASE_URL}/checkin/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!checkinRes.ok) throw new Error("Check-in failed");

      const updated = await checkinRes.json();
      setHasCheckedInToday(true);
      setCurrentStreak(updated.current_streak);

      toast.success("Checked in successfully!");
    } catch (err) {
      console.error("Check-in error:", err);
      toast.error("Check-in failed.");
    } finally {
      setCheckInLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-6">
          {loading ? (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">Loading...</CardContent>
            </Card>
          ) : profile ? (
            <>
              {/* Avatar Section */}
              <Card className="shadow">
                <CardContent className="pt-6 flex flex-col items-center">
                  <div className="relative">
                    {selectedAvatar ? (
                      <Image
                        src={selectedAvatar}
                        alt="Selected Avatar"
                        width={96}
                        height={96}
                        className="rounded-full border border-gray-300"
                      />
                    ) : (
                      <UserCircle className="w-24 h-24 text-gray-400 mb-2" />
                    )}
                    <button
                      onClick={() => setShowSelector(true)}
                      className="absolute bottom-1 right-1 bg-white p-1 rounded-full border shadow hover:bg-gray-100"
                      title="Change Avatar"
                    >
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 mt-3">{profile.username}</h1>

                  {showSelector && (
                    <Card className="border-0 shadow-none">
                      <CardContent className="pt-6">
                        <h2 className="text-md font-semibold text-gray-700 mb-2">
                          Choose your profile picture
                        </h2>
                        <div className="grid grid-cols-5 gap-3 mb-4">
                          {avatarUrls.map((url) => (
                            <button
                              key={url}
                              onClick={() => setSelectedAvatar(url)}
                              className={`border rounded-lg overflow-hidden p-1 transition-all ${
                                selectedAvatar === url
                                  ? "border-green-600 ring-2 ring-green-500"
                                  : "border-gray-200 hover:border-gray-400"
                              }`}
                            >
                              <Image
                                src={url}
                                alt="Avatar"
                                width={64}
                                height={64}
                                className="rounded"
                              />
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-col gap-2 mb-4">
                          <Button
                            onClick={handleSaveAvatar}
                            disabled={!selectedAvatar}
                            className="w-full"
                          >
                            Save Avatar
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedAvatar(originalAvatar);
                              setShowSelector(false);
                            }}
                            variant="secondary"
                            className="w-full"
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* Points */}
              <Card className="shadow text-white bg-[linear-gradient(to_right,#80ed99,#38A3A5)]">
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Trophy className="w-6 h-6 text-yellow-300" />
                    <span className="text-lg font-bold">Total Points</span>
                  </div>
                  <div className="text-4xl font-bold mb-2">
                    {profile.total_points.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              {/* Streak + Check-in */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-gray-800">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span>Daily Streak</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-yellow-50">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Current Streak</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-3xl font-bold text-[#38a3a5]">{currentStreak}</span>
                        <span className="text-gray-500">days</span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(Math.min(currentStreak, 7))].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-8 bg-[linear-gradient(to_top,#80ed99,#38A3A5)] rounded-full"
                        ></div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleDailyCheckIn}
                    disabled={hasCheckedInToday || checkInLoading}
                    className={`w-full h-10 text-lg font-semibold transition-all duration-300 ${
                      hasCheckedInToday
                        ? "bg-[#38a3a5] text-white"
                        : "shadow text-white bg-[#57cc99]"
                    }`}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    {hasCheckedInToday ? "Checked In Today!" : "Daily Check-in"}
                  </Button>
                </CardContent>
              </Card>

              <div className="pt-2">
                <Button onClick={handleLogout} variant="outline" className="w-full h-10">
                  Log out
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">Not authenticated.</CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
