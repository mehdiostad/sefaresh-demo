import { create } from 'zustand';



interface SelectionState {
  selectedItems: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (id: string) => void;
  clearSelection: () => void;
  updateQuantity: (id: string, qty: number) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedItems: [],
  addItem: (item) =>
    set((state) => {
      const exists = state.selectedItems.some((i) => i.id === item.id);
      if (exists) return state;
      return { selectedItems: [...state.selectedItems, item] };
    }),
  removeItem: (id) =>
    set((state) => ({
      selectedItems: state.selectedItems.filter((i) => i.id !== id),
    })),
  clearSelection: () => set({ selectedItems: [] }),
    updateQuantity: (id, qty) =>
    set((state) => ({
      selectedItems: state.selectedItems.map((i) =>
        i.id === id ? { ...i, qty } : i
      ),
    })),
}));
