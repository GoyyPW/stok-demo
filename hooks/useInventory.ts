"use client";

import { useCallback, useEffect, useState } from "react";
import { seedItems } from "@/lib/seed";
import type { Item, Movement } from "@/lib/types";

const KEY = "stok-demo:v1";

type State = { items: Item[]; movements: Movement[] };

export function useInventory() {
  const [state, setState] = useState<State>({ items: [], movements: [] });
  const [ready, setReady] = useState(false);

  // Baca data tersimpan saat halaman pertama dibuka
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setState(raw ? JSON.parse(raw) : { items: seedItems, movements: [] });
    } catch {
      setState({ items: seedItems, movements: [] });
    }
    setReady(true);
  }, []);

  // Simpan setiap kali data berubah
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  const addItem = useCallback((data: Omit<Item, "id">) => {
    setState((s) => ({ ...s, items: [{ ...data, id: crypto.randomUUID() }, ...s.items] }));
  }, []);

  const updateItem = useCallback((id: string, patch: Partial<Omit<Item, "id">>) => {
    setState((s) => ({
      ...s,
      items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) }));
  }, []);

  const adjustStock = useCallback(
    (id: string, type: Movement["type"], qty: number, note: string) => {
      setState((s) => {
        const item = s.items.find((i) => i.id === id);
        if (!item || qty <= 0) return s;
        if (type === "keluar" && qty > item.stock) return s; // stok tidak boleh minus

        const movement: Movement = {
          id: crypto.randomUUID(),
          itemId: id,
          itemName: item.name,
          type,
          qty,
          note,
          date: new Date().toISOString(),
        };

        return {
          items: s.items.map((i) =>
            i.id === id ? { ...i, stock: i.stock + (type === "masuk" ? qty : -qty) } : i
          ),
          movements: [movement, ...s.movements].slice(0, 50),
        };
      });
    },
    []
  );

  const resetData = useCallback(() => {
    setState({ items: seedItems, movements: [] });
  }, []);

  return {
    items: state.items,
    movements: state.movements,
    ready,
    addItem,
    updateItem,
    removeItem,
    adjustStock,
    resetData,
  };
}