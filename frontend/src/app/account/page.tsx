"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    const [userInfo, setUserInfo] = useState<null | { id: number; username: string }>(null);

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
            setFormData({ username: "", password: "" });
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

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUserInfo(null);
        setMessage("✅ Logged out.");
    };

    return (
        <main className="min-h-screen bg-white">
            <Header />
            <div className="flex items-center justify-center px-4 py-12">
                <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                    {userInfo ? (
                        <>
                            <h1 className="text-2xl font-semibold text-center mb-6">My Account</h1>
                            <p className="text-center text-lg">
                                ✅ Logged in as <strong>{userInfo.username}</strong> (ID: {userInfo.id})
                            </p>
                            <div className="text-center mt-6">
                                <Button onClick={handleLogout}>Log out</Button>
                            </div>
                            {message && (
                                <p className="text-center text-sm mt-4 text-green-600">{message}</p>
                            )}
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
