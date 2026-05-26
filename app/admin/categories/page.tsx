"use client";

import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, Check, X } from "lucide-react";
import { adminApi, type AdminCategory } from "@/lib/admin-api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    adminApi.categories.list().then(setCategories);
  }, []);

  async function handleCreate() {
    if (!newName.trim()) return;
    await adminApi.categories.create({ name: newName.trim() });
    setNewName("");
    adminApi.categories.list().then(setCategories);
  }

  async function handleUpdate(id: number) {
    if (!editName.trim()) return;
    await adminApi.categories.update(id, { name: editName.trim() });
    setEditId(null);
    adminApi.categories.list().then(setCategories);
  }

  async function handleDelete(id: number) {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    await adminApi.categories.delete(id);
    adminApi.categories.list().then(setCategories);
  }

  return (
    <div className="flex flex-col gap-4 max-w-lg">

      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="Yangi kategoriya nomi…"
          aria-label="Yangi kategoriya nomi"
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90"
        >
          <Plus size={15} /> Qo&apos;shish
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-3 px-4 py-3">
            {editId === cat.id ? (
              <>
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                  aria-label="Kategoriya nomi"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-primary text-sm outline-none"
                />
                <button type="button" onClick={() => handleUpdate(cat.id)} aria-label="Saqlash" className="text-green-500 hover:text-green-600">
                  <Check size={16} />
                </button>
                <button type="button" onClick={() => setEditId(null)} aria-label="Bekor qilish" className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm font-medium text-[#2C2417]">{cat.name}</span>
                <span className="text-xs text-gray-400">{cat.slug}</span>
                <button
                  type="button"
                  onClick={() => { setEditId(cat.id); setEditName(cat.name); }}
                  aria-label="Tahrirlash"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id)}
                  aria-label="O'chirish"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <p className="px-4 py-6 text-sm text-gray-400 text-center">Kategoriyalar yo&apos;q</p>
        )}
      </div>
    </div>
  );
}
