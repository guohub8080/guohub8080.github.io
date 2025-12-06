"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../../lib/utils.ts";

// Types
interface Column {
  id: string;
  name: string;
  color?: string;
}

interface KanbanData {
  id: string;
  column: string;
  [key: string]: any;
}

interface KanbanContextValue<T extends KanbanData> {
  columns: Column[];
  data: T[];
  activeId: string | null;
}

// Context
const KanbanContext = React.createContext<KanbanContextValue<any> | null>(null);

function useKanban<T extends KanbanData>() {
  const context = React.useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanban must be used within KanbanProvider");
  }
  return context as KanbanContextValue<T>;
}

// Provider
interface KanbanProviderProps<T extends KanbanData> {
  columns: Column[];
  data: T[];
  onDataChange: (data: T[]) => void;
  children: (column: Column) => React.ReactNode;
}

export function KanbanProvider<T extends KanbanData>({
  columns,
  data,
  onDataChange,
  children,
}: KanbanProviderProps<T>) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeItem = data.find((item) => item.id === activeId);
    const overItem = data.find((item) => item.id === overId);

    if (!activeItem) return;

    const activeColumn = activeItem.column;
    const overColumn = overItem?.column || overId;

    if (activeColumn === overColumn) return;

    const updatedData = data.map((item) =>
      item.id === activeId ? { ...item, column: overColumn } : item
    );

    onDataChange(updatedData as T[]);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeItem = data.find((item) => item.id === active.id);
    const overItem = data.find((item) => item.id === over.id);

    if (!activeItem || !overItem) return;

    if (activeItem.column === overItem.column) {
      const columnItems = data.filter((item) => item.column === activeItem.column);
      const activeIndex = columnItems.findIndex((item) => item.id === active.id);
      const overIndex = columnItems.findIndex((item) => item.id === over.id);

      const sortedColumnItems = arrayMove(columnItems, activeIndex, overIndex);
      const otherItems = data.filter((item) => item.column !== activeItem.column);

      onDataChange([...otherItems, ...sortedColumnItems] as T[]);
    }
  }

  return (
    <KanbanContext.Provider value={{ columns, data, activeId }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-6 items-center">
          {columns.map((column) => children(column))}
        </div>
        <DragOverlay>
          {activeId ? (
            <div className="opacity-50">
              {/* Drag overlay content */}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </KanbanContext.Provider>
  );
}

// KanbanBoard
interface KanbanBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

export function KanbanBoard({ id, className, children, ...props }: KanbanBoardProps) {
  const { data } = useKanban();
  const columnItems = data.filter((item) => item.column === id);
  const itemIds = columnItems.map((item) => item.id);

  return (
    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
      <div
        className={cn("flex flex-col gap-3 w-full max-w-5xl pt-6", className)}
        {...props}
      >
        {children}
      </div>
    </SortableContext>
  );
}

// KanbanHeader
export function KanbanHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3 flex justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// KanbanCards
interface KanbanCardsProps<T extends KanbanData> {
  id: string;
  children: (item: T) => React.ReactNode;
}

export function KanbanCards<T extends KanbanData>({ id, children }: KanbanCardsProps<T>) {
  const { data } = useKanban<T>();
  const columnItems = data.filter((item) => item.column === id);

  return (
    <div className="flex gap-3 flex-wrap justify-center">
      {columnItems.map((item) => children(item))}
    </div>
  );
}

// KanbanCard
interface KanbanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  column: string;
  name: string;
}

export const KanbanCard = React.forwardRef<HTMLDivElement, KanbanCardProps>(
  ({ id, column, name, className, children, ...props }, ref) => {
    const { activeId } = useKanban();
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        className={cn(
          "rounded-lg border border-border",
          "bg-card backdrop-blur-sm",
          "p-4 shadow-sm hover:shadow-xl",
          "transition-all duration-300",
          "hover:border-border/80",
          "hover:scale-[1.02]",
          "w-[280px]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

KanbanCard.displayName = "KanbanCard";
