"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/Header" // ✅ Shared header component

export default function AccountPage() {
    const [isRegistering, setIsRegistering] = useState(false)

    return (
        <main className="min-h-screen bg-white">
            <Header /> {/* ✅ Same header as other pages */}

            <div className="flex items-center justify-center px-4 py-12">
                <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                    <h1 className="text-2xl font-semibold text-center mb-6">
                        {isRegistering ? "Create Account" : "Login"}
                    </h1>

                    <form className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {isRegistering && (
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        )}
                        <Button type="submit" className="w-full">
                            {isRegistering ? "Register" : "Login"}
                        </Button>
                    </form>

                    <div className="text-center mt-4 text-sm">
                        {isRegistering ? (
                            <>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setIsRegistering(false)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Log in
                                </button>
                            </>
                        ) : (
                            <>
                                Don’t have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setIsRegistering(true)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
