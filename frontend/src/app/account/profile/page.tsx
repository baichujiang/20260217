"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/Header";
import { UserCircle } from "lucide-react";

type DecodedToken = {
    sub?: string;
    exp: number;
    [key: string]: any;
};

export default function ProfilePage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push("/account");
            return;
        }

        setToken(storedToken);

        try {
            const decoded: DecodedToken = jwtDecode(storedToken);
            const id = decoded.sub || null;
            setUserId(id);
            console.log("✅ Decoded token:", decoded);
        } catch (err) {
            console.error("❌ Failed to decode token:", err);
            setUserId(null);
        } finally {
            setLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
        }
        router.push("/account");
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex items-center justify-center px-4 py-12">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg w-full max-w-md p-8">
                    <div className="flex flex-col items-center mb-6">
                        <UserCircle className="w-16 h-16 text-gray-400 mb-2" />
                        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : token ? (
                        <>
                            {userId ? (
                                <p className="text-center text-lg text-gray-700">
                                    Logged in as user ID: <strong>{userId}</strong>
                                </p>
                            ) : (
                                <p className="text-center text-red-500">
                                    Could not read user ID.
                                </p>
                            )}

                            <Button
                                onClick={handleLogout}
                                className="w-full mt-6"
                                variant="default"
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
