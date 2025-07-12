"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/Header"

export default function RegisterPage() {
    const [formData, setFormData] = useState({ username: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/auth/register",
                {
                    username: formData.username,
                    password: formData.password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            )

            console.log("✅ Backend response:", response.data)
            setMessage("✅ Registered successfully! Redirecting to login...")

            // Wait 3 seconds before redirecting
            setTimeout(() => {
                router.push("/account")
            }, 3000)
        } catch (error: any) {
            console.error("❌ Registration error:", error)
            setMessage(
                error.response?.data?.detail || "❌ Registration failed. Try again."
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-white">
            <Header />
            <div className="flex items-center justify-center px-4 py-12">
                <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-semibold text-center mb-6">Register</h1>
                    <form className="space-y-4" onSubmit={handleRegister}>
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
                            {loading ? "Registering..." : "Register"}
                        </Button>
                    </form>
                    {message && (
                        <p className="text-center text-sm mt-4 text-green-600">{message}</p>
                    )}
                </div>
            </div>
        </main>
    )
}
