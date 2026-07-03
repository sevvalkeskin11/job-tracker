import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import {
  createApplication,
  deleteApplication,
  fetchApplications,
  updateApplication,
} from "../../lib/applications";
import { getApiErrorMessage } from "../../lib/api";
import type { Application, ApplicationInput, ApplicationStatus } from "../../types/application";
import { ApplicationCardContent } from "./ApplicationCardContent";
import { ApplicationFormModal } from "./ApplicationFormModal";
import { KanbanColumn } from "./KanbanColumn";

const COLUMNS: { status: ApplicationStatus; title: string; accentClassName: string }[] = [
  { status: "APPLIED", title: "Applied", accentClassName: "bg-blue-500" },
  { status: "INTERVIEW", title: "Interview", accentClassName: "bg-amber-500" },
  { status: "OFFER", title: "Offer", accentClassName: "bg-emerald-500" },
  { status: "REJECTED", title: "Rejected", accentClassName: "bg-red-500" },
];

const STATUS_SET = new Set<string>(COLUMNS.map((c) => c.status));

type ModalState = { mode: "create" } | { mode: "edit"; application: Application } | null;

export function KanbanBoard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [activeApplication, setActiveApplication] = useState<Application | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    fetchApplications()
      .then(setApplications)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, []);

  function handleDragStart(event: DragStartEvent) {
    const application = applications.find((a) => a.id === event.active.id);
    setActiveApplication(application ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveApplication(null);
    if (!over || !STATUS_SET.has(String(over.id))) return;

    const newStatus = over.id as ApplicationStatus;
    const application = applications.find((a) => a.id === active.id);
    if (!application || application.status === newStatus) return;

    const previousApplications = applications;
    setApplications((apps) =>
      apps.map((a) => (a.id === application.id ? { ...a, status: newStatus } : a))
    );

    try {
      await updateApplication(application.id, { status: newStatus });
    } catch (err) {
      setApplications(previousApplications);
      setError(getApiErrorMessage(err));
    }
  }

  async function handleFormSubmit(input: ApplicationInput) {
    if (modalState?.mode === "edit") {
      const updated = await updateApplication(modalState.application.id, input);
      setApplications((apps) => apps.map((a) => (a.id === updated.id ? updated : a)));
    } else {
      const created = await createApplication(input);
      setApplications((apps) => [created, ...apps]);
    }
    setModalState(null);
  }

  async function handleDelete(application: Application) {
    if (!window.confirm(`Delete application for ${application.position} at ${application.company}?`)) {
      return;
    }
    const previousApplications = applications;
    setApplications((apps) => apps.filter((a) => a.id !== application.id));
    try {
      await deleteApplication(application.id);
    } catch (err) {
      setApplications(previousApplications);
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Applications</h1>
        <button
          type="button"
          onClick={() => setModalState({ mode: "create" })}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + New application
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="font-medium hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading applications...</p>
      ) : (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.status}
                status={column.status}
                title={column.title}
                accentClassName={column.accentClassName}
                applications={applications.filter((a) => a.status === column.status)}
                onEdit={(application) => setModalState({ mode: "edit", application })}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <DragOverlay>
            {activeApplication && (
              <div className="rotate-2 opacity-90">
                <ApplicationCardContent application={activeApplication} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {modalState && (
        <ApplicationFormModal
          application={modalState.mode === "edit" ? modalState.application : null}
          onClose={() => setModalState(null)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
