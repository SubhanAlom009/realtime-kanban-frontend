import { useDroppable } from "@dnd-kit/core";

export default function DroppableColumn({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="board__column"
      data-id={id}
      data-is-over={isOver}
      style={{
        transition: "all 0.3s ease",
      }}
    >
      {children}
    </div>
  );
}
