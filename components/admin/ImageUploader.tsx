"use client";

import { useRef, useState } from "react";
import { Upload, X, Star } from "lucide-react";
import { adminApi } from "@/lib/admin-api";

interface Image { url: string; is_main: boolean }

interface Props {
  images: Image[];
  onChange: (images: Image[]) => void;
}

export default function ImageUploader({ images, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");
    setUploading(true);
    try {
      const results = await Promise.all(
        Array.from(files).map((f) => adminApi.upload(f))
      );
      onChange([
        ...images,
        ...results.map((r, i) => ({
          url: r.url,
          is_main: images.length === 0 && i === 0,
        })),
      ]);
    } catch {
      setError("Rasm yuklab bo'lmadi. ImageKit sozlamalarini tekshiring.");
    } finally {
      setUploading(false);
    }
  }

  function remove(i: number) {
    const next = images.filter((_, idx) => idx !== i);
    if (images[i].is_main && next.length > 0) next[0].is_main = true;
    onChange(next);
  }

  function setMain(i: number) {
    onChange(images.map((img, idx) => ({ ...img, is_main: idx === i })));
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          uploading ? "border-primary/40 bg-primary/5" : "border-gray-200 hover:border-primary/50"
        }`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload size={24} className="mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-500">
          {uploading ? "Yuklanmoqda…" : "Rasm tanlash yoki bu yerga tashlang"}
        </p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP · maks 10MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((img, i) => (
            <div key={i} className="relative group aspect-square">
              <img
                src={img.url}
                alt=""
                className={`w-full h-full object-cover rounded-xl border-2 transition-colors ${
                  img.is_main ? "border-primary" : "border-transparent"
                }`}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="O'chirish"
              >
                <X size={12} />
              </button>
              {!img.is_main && (
                <button
                  type="button"
                  onClick={() => setMain(i)}
                  className="absolute bottom-1 left-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Asosiy rasm"
                  title="Asosiy qilish"
                >
                  <Star size={12} />
                </button>
              )}
              {img.is_main && (
                <span className="absolute bottom-1 left-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  Asosiy
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
