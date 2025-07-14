import { useDroppable } from "@dnd-kit/core";

export default function DroppableColumn({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="board__column"
      style={{
        backgroundColor: isOver ? "#f1f1f1" : "#fff",
        transition: "background-color 0.2s ease",
      }}
    >
      {children}
    </div>
  );
}
