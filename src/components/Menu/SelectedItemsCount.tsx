"use client";

import { useSelectionStore } from "@/stores/useSelectionStore";
import separate from "@/utils/number";
import { IconClipboardText } from "@tabler/icons-react";
import { NotebookPen } from "lucide-react";

export default function SelectedItemsCount({
  selectionIconProps,
}: {
  selectionIconProps?: { cn?: string; color?: string };
}) {
  const selectedItems = useSelectionStore((state) => state.selectedItems);

  return (
    <div className="relative font-yekan">
      <NotebookPen strokeWidth={1.5} 
        size={28}
        color={selectionIconProps?.color || "white"}
        className={selectionIconProps?.cn}
      />
      {selectedItems.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {separate(selectedItems.length)}
        </span>
      )}
    </div>
  );
}
