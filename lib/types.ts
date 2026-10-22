export type Item = {
  id: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  minStock: number;
  price: number;
};

export type Movement = {
  id: string;
  itemId: string;
  itemName: string;
  type: "masuk" | "keluar";
  qty: number;
  note: string;
  date: string; // format ISO
};