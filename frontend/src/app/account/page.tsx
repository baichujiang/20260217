"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/Header"

export default function AccountPage() {
    const router = useRouter()

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        try {
            // ✅ Replace this with actual API request later
            console.log("Logging in with", formData)
            setMessage("✅ Logged in successfully! Redirecting...")

            setTimeout(() => {
                router.push("/")
            }, 3000)
        } catch (err) {
            setMessage("❌ Login failed.")
        } finally {
            setLoading(false)
        }
    }

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
                        <p className="text-center text-sm mt-4 text-green-600">{message}</p>
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
    )
}
