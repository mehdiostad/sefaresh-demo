import ItemModel from "@/Models/ItemModel";


export async function normalizeOrders(categoryId: string) {
  const items = await ItemModel.find({ categoryId }).sort({ order: 1 });

  for (let i = 0; i < items.length; i++) {
    const correctOrder = i + 1;
    if (items[i].order !== correctOrder) {
      items[i].order = correctOrder;
      await items[i].save();
    }
  }
}