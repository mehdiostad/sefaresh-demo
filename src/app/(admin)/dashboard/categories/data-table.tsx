"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { useEffect, useState } from "react";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  onReorder: (newData: { activeItem: TData; overItem: TData }) => void;
}

export function DataTable<TData extends { pageNumber?: number }>({
  columns,
  data,
  onReorder,
}: DataTableProps<TData>) {
  const [items, setItems] = useState(data);
  useEffect(() => {
    setItems(data);
  }, [data]);
  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeItem = items.find((item) => item.pageNumber === +active.id + 1);
    const overItem = items.find((item) => item.pageNumber === +over.id + 1);

    if (!activeItem || !overItem) return;

    const updatedItems = items.map((item) => {
      if (item.pageNumber === activeItem.pageNumber) {
        return { ...item, pageNumber: overItem.pageNumber };
      } else if (item.pageNumber === overItem.pageNumber) {
        return { ...item, pageNumber: activeItem.pageNumber };
      } else {
        return item;
      }
    });

    const sortedItems = [...updatedItems].sort(
      (a, b) => (a.pageNumber ?? 0) - (b.pageNumber ?? 0)
    );

    setItems(sortedItems);
    onReorder?.({
      activeItem: { ...activeItem, pageNumber: overItem.pageNumber },
      overItem: { ...overItem, pageNumber: activeItem.pageNumber },
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.pageNumber?.toString() ?? "")}
        strategy={verticalListSortingStrategy}
      >
        <div className="rounded-md border">
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
              <SortableContext
                items={table.getRowModel().rows.map((row) => row.id)}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row) => (
                  <SortableRow key={row.id} row={row} />
                ))}
              </SortableContext>
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
    transition: { easing: "cubic-bezier(0.2, 0, 0.2, 1)", duration: 300 },
  });
function SortableRow({ row }: { row: any }) {
  const { attributes, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: row.id,
      animateLayoutChanges,
    });

  const style = {
    transform: transform ? `translateY(${transform.y}px)` : undefined,
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      {...attributes}
      // style={style}
      className={`${isDragging ? "ring-2 ring-yellow-300" : ""}`}
      data-state={row.getIsSelected() && "selected"}
    >
      {row.getVisibleCells().map((cell: any) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
