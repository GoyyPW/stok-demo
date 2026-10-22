"use client";

import { useState } from "react";
import type { Item } from "@/lib/types";

type Data = Omit<Item, "id">;
type Props = { item?: Item; onSubmit: (data: Data) => void; onCancel: () => void };

const input =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

export default function ItemForm({ item, onSubmit, onCancel }: Props) {
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const category = String(f.get("category") ?? "").trim() || "Lainnya";
    const unit = String(f.get("unit") ?? "").trim() || "pcs";
    const stock = item ? item.stock : Number(f.get("stock"));
    const minStock = Number(f.get("minStock"));
    const price = Number(f.get("price"));

    if (!name) return setError("Nama barang wajib diisi.");
    if ([stock, minStock, price].some((n) => !Number.isFinite(n) || n < 0)) {
      return setError("Stok, batas minimum, dan harga harus berupa angka 0 atau lebih.");
    }
    onSubmit({ name, category, unit, stock, minStock, price });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="f-name" className="text-sm font-medium">Nama barang</label>
        <input id="f-name" name="name" defaultValue={item?.name} required autoFocus className={input} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="f-category" className="text-sm font-medium">Kategori</label>
          <input id="f-category" name="category" defaultValue={item?.category} placeholder="Sembako" className={input} />
        </div>
        <div>
          <label htmlFor="f-unit" className="text-sm font-medium">Satuan</label>
          <input id="f-unit" name="unit" defaultValue={item?.unit} placeholder="pcs" className={input} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {!item && (
          <div>
            <label htmlFor="f-stock" className="text-sm font-medium">Stok awal</label>
            <input id="f-stock" name="stock" type="number" min="0" step="1" defaultValue={0} required className={input} />
          </div>
        )}
        <div>
          <label htmlFor="f-min" className="text-sm font-medium">Stok minimum</label>
          <input id="f-min" name="minStock" type="number" min="0" step="1" defaultValue={item?.minStock ?? 5} required className={input} />
        </div>
        <div className={item ? "col-span-1" : "col-span-2"}>
          <label htmlFor="f-price" className="text-sm font-medium">Harga satuan (Rp)</label>
          <input id="f-price" name="price" type="number" min="0" step="100" defaultValue={item?.price ?? 0} required className={input} />
        </div>
      </div>

      {item && (
        <p className="text-xs text-slate-500">
          Jumlah stok diubah lewat tombol Masuk atau Keluar supaya tercatat di riwayat.
        </p>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
          Batal
        </button>
        <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          Simpan
        </button>
      </div>
    </form>
  );
}