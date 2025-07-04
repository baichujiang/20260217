"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/Header";
import { UserCircle } from "lucide-react";
import Image from "next/image";

type DecodedToken = {
    sub?: string;
    exp: number;
    [key: string]: any;
};

export default function ProfilePage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [showSelector, setShowSelector] = useState(false);

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
                const decoded: DecodedToken = jwtDecode(storedToken);
                setUsername(decoded.sub || null);
                console.log("✅ Decoded token:", decoded);

                const response = await fetch("http://localhost:8000/auth/me", {
                    headers: {
                        Authorization: `Bearer ${storedToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("✅ Fetched profile:", data);
                    setSelectedAvatar(data.avatar_url || null);
                    if (data.avatar_url) {
                        localStorage.setItem("selectedAvatar", data.avatar_url);
                    } else {
                        localStorage.removeItem("selectedAvatar");
                    }
                } else {
                    console.error("❌ Failed to fetch profile");
                    setSelectedAvatar(null);
                }
            } catch (err) {
                console.error("❌ Failed to decode token or fetch profile:", err);
                setUsername(null);
                setSelectedAvatar(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("selectedAvatar");
        router.push("/account");
    };

    const handleSaveAvatar = async () => {
        if (!selectedAvatar || !token) return;

        try {
            const response = await fetch("http://localhost:8000/auth/avatar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ avatar_url: selectedAvatar }),
            });

            if (!response.ok) throw new Error("Failed to save avatar");

            localStorage.setItem("selectedAvatar", selectedAvatar);
            setShowSelector(false);
            alert("Avatar saved!");
        } catch (err) {
            console.error(err);
            alert("Could not save avatar");
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex items-center justify-center px-4 py-12">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg w-full max-w-2xl p-8">
                    <div className="flex flex-col items-center mb-6">
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
                        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : username ? (
                        <>
                            <p className="text-center text-lg text-gray-700 mb-4">
                                Logged in as <strong>{username}</strong>
                            </p>

                            {!showSelector ? (
                                <Button
                                    onClick={() => setShowSelector(true)}
                                    className="w-full mb-4"
                                >
                                    Change Avatar
                                </Button>
                            ) : (
                                <>
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
                                                        ? "border-blue-500 ring-2 ring-blue-300"
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
                                            onClick={() => setShowSelector(false)}
                                            variant="secondary"
                                            className="w-full"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </>
                            )}

                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="w-full"
                            >
                                Log out
                            </Button>
                        </>
                    ) : (
                        <p className="text-center text-gray-500">Not authenticated.</p>
                    )}
                </div>
            </div>
        </main>
    );
}
