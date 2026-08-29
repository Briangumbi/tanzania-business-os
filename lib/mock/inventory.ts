export type Product = {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  lowStockThreshold: number;
  priceTZS: number;
};

export const products: Product[] = [
  { id: "1", name: "Sugar (2kg bag)", category: "Groceries", unit: "bag", quantity: 34, lowStockThreshold: 10, priceTZS: 6500 },
  { id: "2", name: "Cooking oil (1L)", category: "Groceries", unit: "bottle", quantity: 6, lowStockThreshold: 8, priceTZS: 5200 },
  { id: "3", name: "Maize flour (Unga, 2kg)", category: "Groceries", unit: "bag", quantity: 41, lowStockThreshold: 12, priceTZS: 4800 },
  { id: "4", name: "Bar soap", category: "Household", unit: "piece", quantity: 5, lowStockThreshold: 15, priceTZS: 1200 },
  { id: "5", name: "Rice (5kg)", category: "Groceries", unit: "bag", quantity: 18, lowStockThreshold: 10, priceTZS: 15500 },
  { id: "6", name: "Airtime scratch cards", category: "Mobile", unit: "card", quantity: 2, lowStockThreshold: 20, priceTZS: 1000 },
  { id: "7", name: "Salt (500g)", category: "Groceries", unit: "packet", quantity: 27, lowStockThreshold: 10, priceTZS: 500 },
  { id: "8", name: "Tea leaves (250g)", category: "Groceries", unit: "packet", quantity: 22, lowStockThreshold: 8, priceTZS: 2300 },
  { id: "9", name: "Candles", category: "Household", unit: "pack", quantity: 9, lowStockThreshold: 10, priceTZS: 1800 },
  { id: "10", name: "Bottled water (500ml)", category: "Beverages", unit: "bottle", quantity: 60, lowStockThreshold: 24, priceTZS: 500 },
  { id: "11", name: "Laundry powder", category: "Household", unit: "packet", quantity: 14, lowStockThreshold: 10, priceTZS: 3200 },
  { id: "12", name: "Exercise books", category: "Stationery", unit: "piece", quantity: 3, lowStockThreshold: 20, priceTZS: 800 },
];
