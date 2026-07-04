import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { fetchApplications } from "../../lib/applications";
import { getApiErrorMessage } from "../../lib/api";
import type { Application, ApplicationStatus } from "../../types/application";

const STATUS_META: Record<ApplicationStatus, { label: string; color: string }> = {
  APPLIED: { label: "Applied", color: "#2a78d6" },
  INTERVIEW: { label: "Interview", color: "#fab219" },
  OFFER: { label: "Offer", color: "#0ca30c" },
  REJECTED: { label: "Rejected", color: "#d03b3b" },
};

const STATUS_ORDER: ApplicationStatus[] = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

export function StatsPanel() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications()
      .then(setApplications)
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="mb-6 rounded-lg border border-gray-200 bg-white px-6 py-8 text-sm text-gray-500">
        Loading stats...
      </div>
    );
  }

  if (error) {
    return null;
  }

  const total = applications.length;
  const data = STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_META[status].label,
    color: STATUS_META[status].color,
    value: applications.filter((a) => a.status === status).length,
  }));
  const hasData = total > 0;

  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white px-6 py-5">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="shrink-0 text-center sm:text-left">
          <p className="text-sm text-gray-500">Toplam Başvuru</p>
          <p className="text-4xl font-semibold text-gray-900">{total}</p>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-center gap-6 sm:justify-end">
          {hasData ? (
            <>
              <div className="h-32 w-32 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={32}
                      outerRadius={56}
                      paddingAngle={2}
                      stroke="#fcfcfb"
                      strokeWidth={2}
                    >
                      {data.map((entry) => (
                        <Cell key={entry.status} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex flex-col gap-1.5 text-sm">
                {data.map((entry) => (
                  <li key={entry.status} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-gray-700">{entry.label}</span>
                    <span className="font-medium text-gray-900">{entry.value}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-gray-500">Henüz başvuru yok.</p>
          )}
        </div>
      </div>
    </div>
  );
}
