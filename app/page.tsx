"use client";

import { useState } from "react";
import HistoryList from "@/components/HistoryList";
import ItemForm from "@/components/ItemForm";
import ItemTable from "@/components/ItemTable";
import Modal from "@/components/Modal";
import StatCards from "@/components/StatCards";
import StockDialog from "@/components/StockDialog";
import { useInventory } from "@/hooks/useInventory";
import type { Item } from "@/lib/types";

type Dialog =
  | { kind: "add" }
  | { kind: "edit"; item: Item }
  | { kind: "stock"; item: Item; type: "masuk" | "keluar" }
  | { kind: "delete"; item: Item }
  | { kind: "reset" }
  | null;

function titleOf(d: Dialog) {
  if (!d) return "";
  if (d.kind === "add") return "Tambah barang";
  if (d.kind === "edit") return `Ubah ${d.item.name}`;
  if (d.kind === "stock") return `Stok ${d.type}: ${d.item.name}`;
  if (d.kind === "delete") return `Hapus ${d.item.name}?`;
  return "Kembalikan data contoh?";
}

export default function Home() {
  const { items, movements, ready, addItem, updateItem, removeItem, adjustStock, resetData } =
    useInventory();
  const [dialog, setDialog] = useState<Dialog>(null);
  const close = () => setDialog(null);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">StokKu</h1>
          <p className="mt-1 text-slate-600">Pantau stok warung dan toko dalam satu layar.</p>
        </div>
        <button
          type="button"
          onClick={() => setDialog({ kind: "reset" })}
          className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Reset data demo
        </button>
      </header>

      {!ready ? (
        <p className="mt-8 text-slate-500">Memuat data...</p>
      ) : (
        <>
          <StatCards items={items} />
          <ItemTable
            items={items}
            onAdd={() => setDialog({ kind: "add" })}
            onEdit={(item) => setDialog({ kind: "edit", item })}
            onStock={(item, type) => setDialog({ kind: "stock", item, type })}
            onDelete={(item) => setDialog({ kind: "delete", item })}
          />
          <HistoryList movements={movements} />
        </>
      )}

      <Modal open={dialog !== null} title={titleOf(dialog)} onClose={close}>
        {dialog?.kind === "add" && (
          <ItemForm
            onCancel={close}
            onSubmit={(data) => {
              addItem(data);
              close();
            }}
          />
        )}

        {dialog?.kind === "edit" && (
          <ItemForm
            item={dialog.item}
            onCancel={close}
            onSubmit={(data) => {
              updateItem(dialog.item.id, data);
              close();
            }}
          />
        )}

        {dialog?.kind === "stock" && (
          <StockDialog
            item={dialog.item}
            type={dialog.type}
            onCancel={close}
            onSubmit={(qty, note) => {
              adjustStock(dialog.item.id, dialog.type, qty, note);
              close();
            }}
          />
        )}

        {dialog?.kind === "delete" && (
          <div>
            <p className="text-sm text-slate-600">
              Barang ini akan dihapus dari daftar. Riwayat stok yang sudah tercatat tetap tersimpan.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={close} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  removeItem(dialog.item.id);
                  close();
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Hapus barang
              </button>
            </div>
          </div>
        )}

        {dialog?.kind === "reset" && (
          <div>
            <p className="text-sm text-slate-600">
              Semua perubahan dan riwayat akan dihapus, lalu daftar barang kembali ke data contoh.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={close} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  resetData();
                  close();
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Kembalikan data contoh
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}