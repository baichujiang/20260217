"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/Header";

export default function AccountPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/account/profile";

    // 🚀 Check if already logged in
    useEffect(() => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (!token) return;
    
          // Verify if token is still valid
          fetch("http://localhost:8000/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => {
              if (res.ok) {
                router.push(redirect);
              } else {
                localStorage.removeItem("token");
                setMessage("Your login session has expired. Please sign in again to continue.");
              }
            })
            .catch(() => {
              localStorage.removeItem("token");
              setMessage("Failed to verify login status. Please log in again.");
            });
        }
      }, [router, redirect]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const params = new URLSearchParams();
            params.append("username", formData.username);
            params.append("password", formData.password);

            const response = await axios.post(
                "http://127.0.0.1:8000/auth/token",
                params,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            const { access_token } = response.data;
            console.log("✅ Received token:", access_token);
            localStorage.setItem("token", access_token);

            setMessage("✅ Logged in successfully!");

            // 🚀 Immediately navigate to profile
            router.push(redirect);
        } catch (err: any) {
            console.error("❌ Login error:", err);
            if (err.response) {
                setMessage(`❌ ${err.response.status}: ${JSON.stringify(err.response.data)}`);
            } else {
                setMessage("❌ Login failed. Check console for details.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white">
            <Header />
            <div className="flex items-center justify-center px-4 py-12">
                <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                    {message && (
                        <p className="text-center text-sm mt-4 text-red-600">{message}</p>
                    )}
                    <div className="text-center mt-4 text-sm">
                        Don’t have an account?{" "}
                        <button
                            type="button"
                            onClick={() => router.push("/account/register")}
                            className="text-blue-600 hover:underline"
                        >
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

