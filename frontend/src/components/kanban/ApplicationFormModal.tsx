import { useState, type FormEvent } from "react";
import type { Application, ApplicationInput } from "../../types/application";
import { getApiErrorMessage } from "../../lib/api";

function toDateInputValue(dateStr: string): string {
  return dateStr.slice(0, 10);
}

interface Props {
  application: Application | null;
  onClose: () => void;
  onSubmit: (input: ApplicationInput) => Promise<void>;
}

export function ApplicationFormModal({ application, onClose, onSubmit }: Props) {
  const isEdit = application !== null;
  const [company, setCompany] = useState(application?.company ?? "");
  const [position, setPosition] = useState(application?.position ?? "");
  const [appliedDate, setAppliedDate] = useState(
    application ? toDateInputValue(application.appliedDate) : toDateInputValue(new Date().toISOString())
  );
  const [notes, setNotes] = useState(application?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ company, position, appliedDate, notes: notes || undefined });
    } catch (err) {
      setError(getApiErrorMessage(err));
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {isEdit ? "Edit application" : "New application"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="company" className="mb-1 block text-sm font-medium text-gray-700">
              Company
            </label>
            <input
              id="company"
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="position" className="mb-1 block text-sm font-medium text-gray-700">
              Position
            </label>
            <input
              id="position"
              type="text"
              required
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="appliedDate" className="mb-1 block text-sm font-medium text-gray-700">
              Applied date
            </label>
            <input
              id="appliedDate"
              type="date"
              required
              value={appliedDate}
              onChange={(e) => setAppliedDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Add application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
