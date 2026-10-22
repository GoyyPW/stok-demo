import { formatRupiah } from "@/lib/format";
import type { Item } from "@/lib/types";

export default function StatCards({ items }: { items: Item[] }) {
  const low = items.filter((i) => i.stock <= i.minStock).length;
  const value = items.reduce((sum, i) => sum + i.stock * i.price, 0);

  return (
    <section aria-label="Ringkasan" className="mt-8 grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-500">Jenis barang</p>
        <p className="mt-1 text-3xl font-bold">{items.length}</p>
      </div>

      <div
        className={`rounded-xl border p-5 ${
          low > 0 ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white"
        }`}
      >
        <p className="text-sm text-slate-500">Stok menipis</p>
        <p className="mt-1 text-3xl font-bold">{low}</p>
        <p className="mt-1 text-sm text-slate-600">
          {low > 0 ? "Perlu segera diisi ulang" : "Semua stok aman"}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-500">Nilai persediaan</p>
        <p className="mt-1 text-3xl font-bold">{formatRupiah(value)}</p>
      </div>
    </section>
  );
}