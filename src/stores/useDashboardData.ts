// stores/useDashboardData.ts
import { imageUrl } from "@/demo/seed";
import { IItem } from "@/Models/ItemModel";
import { create } from "zustand";
export type DashboardData = {
  user: IDashboardUser | null;
  fullMenu: MenuProps[];
  setData: (data: { user: any; fullMenu: any }) => void;
  addCategory: (newCategory: any) => void;
  deleteCategory: (id: string) => void;
  deleteItem: (item: string, cat: string) => void;
  updateItemsOrder: (catId: string, items: IItem[]) => void;
  updateItem: (
    item: {
      itemName: string;
      price: string | number;
      description?: string;
      _id: string;
      img?: File;
    },
    cat: string
  ) => void;
  updateCategory: (data: PreviewMenuProps, catId: string) => void;
  addItem: (data: any, catId: string) => void;
  updateUser: (data: {
    menuName?: string | undefined;
    phone?: string | undefined;
    address?: string | undefined;
    menuLogo?: string;
    qrcode?: string;
  }) => void;
};

export const useDashboardData = create<DashboardData>((set) => ({
  user: null,
  fullMenu: [],
  items: [],
  setData: (data) => set(data),
  addCategory: (newCategory) => {
    set((state) => ({ fullMenu: [...state.fullMenu, newCategory] }));
  },
  deleteCategory: (id) => {
    set((state) => {
      const remainingCategories = state.fullMenu.filter((a) => a._id !== id);
      const updatedCatPageNumbers = remainingCategories.map(
        (category, index) => {
          return { ...category, pageNumber: index + 1 };
        }
      );

      return { fullMenu: updatedCatPageNumbers };
    });
  },
  deleteItem: (item, cat) => {
    set((state) => ({
      fullMenu: state.fullMenu.map((category) =>
        category._id === cat
          ? {
              ...category,
              items: category.items.filter(
                (menuItem: any) => menuItem._id !== item
              ),
            }
          : category
      ),
    }));
  },
  updateItem: (item, catId) => {
    set((state) => ({
      fullMenu: state.fullMenu.map((cat) =>
        cat._id === catId
          ? {
              ...cat,
              items: cat.items.map((i) => (i._id === item._id ? item : i)),
            }
          : cat
      ),
    }));
  },
  updateCategory: (data, catId) => {
    set((state) => ({
      fullMenu: state.fullMenu.map((cat) =>
        cat._id === catId ? { ...cat, ...data } : cat
      ),
    }));
  },
  addItem: (data, catId) => {
    set((state) => ({
      fullMenu: state.fullMenu.map((cat: any) =>
        cat._id === catId
          ? {
              ...cat,
              items: Array.isArray(cat.items) ? [...cat.items, data] : [data],
            }
          : cat
      ),
    }));
  },
  updateUser: (data) => {
    set((state) => ({
      user: state.user
        ? data.menuLogo
          ? {
              ...state.user,
              menuLogo: imageUrl(data.menuLogo, "userLogos"),
              id: state.user.id,
            }
          : { ...state.user, ...data, id: state.user.id }
        : null,
    }));
  },
  updateItemsOrder: (catId: string, items: IItem[]) => {
    set((state) => ({
      fullMenu: state.fullMenu.map((cat) =>
        cat._id === catId ? { ...cat, items } : cat
      ),
    }));
  },
}));
