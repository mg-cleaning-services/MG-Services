import { Link } from "react-router-dom";

import SectionCard from "./SectionCard";
import EmptyState from "./EmptyState";

export default function UpcomingJobs({ jobs }) {
  return (
    <SectionCard title="Upcoming Jobs" description="Next scheduled jobs.">
      {jobs.length === 0 ? (
        <EmptyState text="No upcoming jobs." />
      ) : (
        <div className="space-y-3">
          {jobs.slice(0, 5).map((job) => (
            <Link
              key={job.id}
              to={`/admin/jobs/${job.id}`}
              className="block rounded-2xl border border-[#2E7D32]/10 p-4 transition hover:border-[#2E7D32]/25"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#1A1A1A]">
                    {job.jobCode || "Job"}
                  </p>

                  <p className="mt-1 text-sm text-[#1A1A1A]/60">
                    {job.location?.suburb || "Location not set"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {formatDate(job.schedule?.date)}
                  </p>

                  <p className="mt-1 text-sm text-[#1A1A1A]/60">
                    {job.schedule?.startTime || "Time not set"}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-[#2E7D32]/10 pt-3">
                <p className="text-sm text-[#1A1A1A]/60">
                  Team:{" "}
                  <span className="font-medium text-[#1A1A1A]">
                    {formatTeam(job.team)}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function formatTeam(team = []) {
  if (team.length === 0) {
    return "Unassigned";
  }

  if (team.length === 1) {
    return team[0].name;
  }

  return `${team[0].name} +${team.length - 1}`;
}

function formatDate(date) {
  if (!date) {
    return "Date not set";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
