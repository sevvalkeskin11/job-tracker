import { useDroppable } from "@dnd-kit/core";
import type { Application, ApplicationStatus } from "../../types/application";
import { ApplicationCard } from "./ApplicationCard";

interface Props {
  status: ApplicationStatus;
  title: string;
  accentClassName: string;
  applications: Application[];
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
}

export function KanbanColumn({
  status,
  title,
  accentClassName,
  applications,
  onEdit,
  onDelete,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-lg bg-gray-100">
      <div className="flex items-center gap-2 px-4 py-3">
        <span className={`h-2 w-2 rounded-full ${accentClassName}`} />
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
        <span className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
          {applications.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`min-h-[300px] flex-1 space-y-3 rounded-b-lg p-3 transition-colors ${
          isOver ? "bg-indigo-50 ring-2 ring-inset ring-indigo-300" : ""
        }`}
      >
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            onEdit={() => onEdit(application)}
            onDelete={() => onDelete(application)}
          />
        ))}
      </div>
    </div>
  );
}
