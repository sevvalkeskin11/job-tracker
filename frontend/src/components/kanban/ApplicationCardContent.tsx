import type { Application } from "../../types/application";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface Props {
  application: Application;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ApplicationCardContent({ application, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-gray-900">{application.company}</h3>
          <p className="truncate text-sm text-gray-600">{application.position}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            aria-label="Edit application"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onEdit}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-8.5 8.5a2 2 0 0 1-.83.497l-3.03.91a.5.5 0 0 1-.62-.62l.91-3.03a2 2 0 0 1 .497-.83l8.5-8.5Z" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Delete application"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onDelete}
            className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.25H3.5a.75.75 0 0 0 0 1.5h.276l.664 9.294A2.75 2.75 0 0 0 7.184 17.5h5.632a2.75 2.75 0 0 0 2.744-2.706l.664-9.294h.276a.75.75 0 0 0 0-1.5H14v-.25A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4.5h2.5v-.25a1.25 1.25 0 0 0-1.25-1.25h-2.5a1.25 1.25 0 0 0-1.25 1.25v.25H10Zm-2 3a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5A.75.75 0 0 1 8 7.5Zm4.75.75a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0v-5.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-400">{formatDate(application.appliedDate)}</p>
      {application.notes && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-500">{application.notes}</p>
      )}
    </div>
  );
}
