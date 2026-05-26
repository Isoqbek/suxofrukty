"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await adminApi.login(email, password);
      if (!data.token) {
        setError("Login yoki parol noto'g'ri");
        return;
      }
      localStorage.setItem("admin_token", data.token);
      router.push("/admin/dashboard");
    } catch {
      setError("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <h1 className="font-montserrat font-bold text-xl text-[#2C2417] mb-1">Admin Panel</h1>
        <p className="text-sm text-gray-400 mb-6">Suxofrukty boshqaruv tizimi</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary transition-colors"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">Parol</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary transition-colors"
            />
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 mt-1"
          >
            {loading ? "Kirish…" : "Kirish"}
          </button>
        </form>
      </div>
    </div>
  );
}
