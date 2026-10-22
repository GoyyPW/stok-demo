"use client";

import { useState } from "react";
import { formatTanggal } from "@/lib/format";
import type { Movement } from "@/lib/types";

const LIMIT = 8;

export default function HistoryList({ movements }: { movements: Movement[] }) {
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? movements : movements.slice(0, LIMIT);

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold">Riwayat stok</h2>

      {movements.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
          Belum ada pergerakan stok. Klik Masuk atau Keluar di tabel untuk mencatat yang pertama.
        </p>
      ) : (
        <>
          <ul className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {shown.map((m) => (
              <li key={m.id} className="flex items-start justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{m.itemName}</p>
                  <p className="text-xs text-slate-500">{formatTanggal(m.date)}</p>
                  {m.note && <p className="mt-0.5 text-xs text-slate-600">{m.note}</p>}
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums ${
                    m.type === "masuk" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-800"
                  }`}
                >
                  {m.type === "masuk" ? "Masuk +" : "Keluar -"}
                  {m.qty}
                </span>
              </li>
            ))}
          </ul>

          {movements.length > LIMIT && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="mt-3 text-sm font-medium text-indigo-700 hover:underline"
            >
              {showAll ? "Tampilkan lebih sedikit" : `Tampilkan semua (${movements.length})`}
            </button>
          )}
        </>
      )}
    </section>
  );
}