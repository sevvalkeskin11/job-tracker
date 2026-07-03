import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Application } from "../../types/application";
import { ApplicationCardContent } from "./ApplicationCardContent";

interface Props {
  application: Application;
  onEdit: () => void;
  onDelete: () => void;
}

export function ApplicationCard({ application, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab touch-none active:cursor-grabbing"
    >
      <ApplicationCardContent application={application} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
