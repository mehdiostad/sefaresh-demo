"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable";

import { useState } from "react";
import { IItem } from "@/Models/ItemModel";
import { useDashboardData } from "@/stores/useDashboardData";
import { toast } from "sonner";

interface DataTableProps<TData extends IItem, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  categoryId: string;
  username?: string;
}

export function DataTable<TData extends IItem, TValue>({
  columns,
  data,
  categoryId,
  username,
}: DataTableProps<TData, TValue>) {
  const updateItemsOrder = useDashboardData((s) => s.updateItemsOrder);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id || isUpdating) return;

    const activeItem = data.find((item) => item.order === +active.id + 1);
    const overItem = data.find((item) => item.order === +over.id + 1);
    if (!activeItem || !overItem) return;

    let updatedItems = data.map((item) => {
      if (item._id === activeItem._id)
        return { ...item, order: overItem.order };
      if (item._id === overItem._id)
        return { ...item, order: activeItem.order };
      return item;
    });

    updatedItems = updatedItems
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item, index) => ({ ...item, order: index + 1 }));

    setIsUpdating(true);
    updateItemsOrder(categoryId, updatedItems);

    try {
      await Promise.all(
        updatedItems.map((item) =>
          fetch(`/api/items/${item._id}`, {
            method: "PUT",
            body: JSON.stringify({ order: item.order }),
          })
        )
      );
      const revalidateRes = await fetch(`/api/revalidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
        }),
      });
      if (!revalidateRes.ok) {
        console.error("Failed to revalidate path");
      }
      toast("آیتم‌ها با موفقیت بروز شدند.");
    } catch (err) {
      toast("خطا در به روز رسانی");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={data.map((item) => item.order?.toString() ?? "")}
        strategy={verticalListSortingStrategy}
      >
        <div className="relative rounded-md border">
          {/* Spinner overlay */}
          {isUpdating && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead className="text-right" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table
                  .getRowModel()
                  .rows.map((row) => (
                    <SortableRow
                      key={row.id}
                      row={row}
                      isUpdating={isUpdating}
                    />
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </SortableContext>
    </DndContext>
  );
}

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({
    ...args,
    transition: { easing: "ease", duration: 300 },
  });

function SortableRow({ row, isUpdating }: { row: any; isUpdating: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
    animateLayoutChanges,
  });

  return (
    <TableRow
      ref={setNodeRef}
      className={`cursor-default ${isDragging ? "ring-2 ring-blue-300" : ""}`}
      data-state={row.getIsSelected() && "selected"}
      style={{ transition }}
    >
      {row.getVisibleCells().map((cell: any) => {
        const isDragHandleCell = cell.column.id === "drag";
        return (
          <TableCell key={cell.id}>
            {isDragHandleCell ? (
              <div
                {...attributes}
                {...listeners}
                className={`cursor-grab ${
                  isUpdating ? "pointer-events-none opacity-50" : ""
                }`}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ) : (
              flexRender(cell.column.columnDef.cell, cell.getContext())
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
}
