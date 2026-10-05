"use client";

import { useState } from "react";

export default function ControlledForm() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Contoh validasi real-time
        if (name === "username" && value.length > 0 && value.length < 3) {
            setError("Username minimal 3 karakter");
        } else if (name === "username") {
            setError("");
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Data Controlled Form dikirim:", formData);
        alert(`Form Terkirim!\nUsername: ${formData.username}\nEmail: ${formData.email}`);
    };

    return (
        <div className="p-6 max-w-md border rounded-xl shadow-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold mb-4">Controlled Form</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Masukkan username"
                        className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                    />
                    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="nama@email.com"
                        className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                    />
                </div>

                <button
                    type="submit"
                    disabled={!!error || !formData.username || !formData.email}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    Kirim (Controlled)
                </button>
            </form>
        </div>
    );
}