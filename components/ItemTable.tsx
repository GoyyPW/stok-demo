"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/format";
import type { Item } from "@/lib/types";

type Props = {
  items: Item[];
  onAdd: () => void;
  onEdit: (item: Item) => void;
  onStock: (item: Item, type: "masuk" | "keluar") => void;
  onDelete: (item: Item) => void;
};

function getStatus(item: Item) {
  if (item.stock === 0) return { label: "Habis", cls: "bg-red-100 text-red-800" };
  if (item.stock <= item.minStock) return { label: "Menipis", cls: "bg-amber-100 text-amber-800" };
  return { label: "Aman", cls: "bg-emerald-100 text-emerald-800" };
}

function StatusBadge({ item }: { item: Item }) {
  const s = getStatus(item);
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

type ActionsProps = {
  item: Item;
  large?: boolean;
  className?: string;
  onEdit: Props["onEdit"];
  onStock: Props["onStock"];
  onDelete: Props["onDelete"];
};

function Actions({ item, large, className = "", onEdit, onStock, onDelete }: ActionsProps) {
  const btn = `rounded-md border border-slate-300 font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 ${
    large ? "px-3 py-2.5 text-sm" : "px-2.5 py-1 text-xs"
  }`;

  return (
    <div className={className}>
      <button type="button" className={btn} aria-label={`Stok masuk ${item.name}`} onClick={() => onStock(item, "masuk")}>
        Masuk
      </button>
      <button type="button" className={btn} aria-label={`Stok keluar ${item.name}`} disabled={item.stock === 0} onClick={() => onStock(item, "keluar")}>
        Keluar
      </button>
      <button type="button" className={btn} aria-label={`Ubah ${item.name}`} onClick={() => onEdit(item)}>
        Ubah
      </button>
      <button type="button" className={`${btn} text-red-700`} aria-label={`Hapus ${item.name}`} onClick={() => onDelete(item)}>
        Hapus
      </button>
    </div>
  );
}

export default function ItemTable({ items, onAdd, onEdit, onStock, onDelete }: Props) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const shown = q
    ? items.filter((i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
    : items;

  return (
    <section id="barang" className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Daftar barang</h2>
        <div className="flex gap-2">
          <label htmlFor="cari" className="sr-only">Cari barang</label>
          <input
            id="cari"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau kategori"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:w-64 sm:flex-none"
          />
          <button
            type="button"
            onClick={onAdd}
            className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Tambah barang
          </button>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
          {items.length === 0
            ? "Belum ada barang. Klik Tambah barang untuk mulai."
            : `Tidak ada barang yang cocok dengan “${query}”. Coba kata lain.`}
        </p>
      ) : (
        <>
          {/* HP: satu kartu per barang */}
          <ul className="mt-4 space-y-3 md:hidden">
            {shown.map((item) => (
              <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.category}</p>
                  </div>
                  <StatusBadge item={item} />
                </div>

                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold tabular-nums">
                      {item.stock} {item.unit}
                    </p>
                    <p className="text-xs text-slate-500">minimal {item.minStock}</p>
                  </div>
                  <p className="text-sm tabular-nums text-slate-700">{formatRupiah(item.price)}</p>
                </div>

                <Actions
                  item={item}
                  large
                  className="mt-4 grid grid-cols-2 gap-2"
                  onEdit={onEdit}
                  onStock={onStock}
                  onDelete={onDelete}
                />
              </li>
            ))}
          </ul>

          {/* Layar lebar: tabel */}
          <div className="mt-4 hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Barang</th>
                  <th className="px-4 py-3 font-medium">Stok</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Harga</th>
                  <th className="px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shown.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.category}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium tabular-nums">
                        {item.stock} {item.unit}
                      </p>
                      <p className="text-xs text-slate-500">minimal {item.minStock}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge item={item} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatRupiah(item.price)}</td>
                    <td className="px-4 py-3">
                      <Actions
                        item={item}
                        className="flex flex-wrap gap-1.5"
                        onEdit={onEdit}
                        onStock={onStock}
                        onDelete={onDelete}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}