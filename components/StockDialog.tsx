"use client";

import { useState } from "react";
import type { Item } from "@/lib/types";

type Props = {
  item: Item;
  type: "masuk" | "keluar";
  onSubmit: (qty: number, note: string) => void;
  onCancel: () => void;
};

const input =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

export default function StockDialog({ item, type, onSubmit, onCancel }: Props) {
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const qty = Number(f.get("qty"));
    const note = String(f.get("note") ?? "").trim();

    if (!Number.isInteger(qty) || qty <= 0) {
      return setError("Jumlah harus bilangan bulat lebih dari 0.");
    }
    if (type === "keluar" && qty > item.stock) {
      return setError(`Stok ${item.name} hanya ${item.stock} ${item.unit}.`);
    }
    onSubmit(qty, note);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-slate-600">
        Stok sekarang: <strong>{item.stock} {item.unit}</strong>
      </p>

      <div>
        <label htmlFor="s-qty" className="text-sm font-medium">Jumlah ({item.unit})</label>
        <input id="s-qty" name="qty" type="number" min="1" step="1" required autoFocus className={input} />
      </div>

      <div>
        <label htmlFor="s-note" className="text-sm font-medium">Catatan (opsional)</label>
        <input
          id="s-note"
          name="note"
          placeholder={type === "masuk" ? "Contoh: belanja dari supplier" : "Contoh: terjual atau rusak"}
          className={input}
        />
      </div>

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
          {type === "masuk" ? "Tambah stok" : "Kurangi stok"}
        </button>
      </div>
    </form>
  );
}