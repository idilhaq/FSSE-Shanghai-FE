"use client";

import { useRef, FormEvent } from "react";

export default function UncontrolledForm() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Membaca nilai dari elemen DOM langsung via useRef
        const username = usernameRef.current?.value ?? "";
        const email = emailRef.current?.value ?? "";

        console.log("Data Uncontrolled Form dikirim:", { username, email });
        alert(`Form Terkirim!\nUsername: ${username}\nEmail: ${email}`);

        // Opsional: Reset form manual
        e.currentTarget.reset();
    };

    return (
        <div className="p-6 max-w-md border rounded-xl shadow-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold mb-4">Uncontrolled Form</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Username:</label>
                    <input
                        type="text"
                        ref={usernameRef}
                        defaultValue=""
                        placeholder="Masukkan username"
                        className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Email:</label>
                    <input
                        type="email"
                        ref={emailRef}
                        defaultValue=""
                        placeholder="nama@email.com"
                        className="w-full px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-transparent"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                    Kirim (Uncontrolled)
                </button>
            </form>
        </div>
    );
}