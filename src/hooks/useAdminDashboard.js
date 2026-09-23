import { useEffect, useMemo, useState } from "react";

import { getRequests } from "@/services/requestService";
import { getJobs } from "@/services/jobService";
import { getEmployees } from "@/services/employeeService";

export default function useAdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setLoadError("");

        const [requestsData, jobsData, employeesData] = await Promise.all([
          getRequests(),
          getJobs(),
          getEmployees(),
        ]);

        if (!active) return;

        setRequests(requestsData);
        setJobs(jobsData);
        setEmployees(employeesData);
      } catch (error) {
        console.error("Could not load dashboard:", error);

        if (active) {
          setLoadError("Could not load dashboard data.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const newRequests = useMemo(
    () => requests.filter((request) => request.status === "new"),
    [requests],
  );

  const unassignedJobs = useMemo(
    () =>
      jobs.filter(
        (job) =>
          job.status === "unassigned" && (!job.team || job.team.length === 0),
      ),
    [jobs],
  );

  const activeEmployees = useMemo(
    () => employees.filter((employee) => employee.status === "active"),
    [employees],
  );

  const upcomingJobs = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return jobs
      .filter((job) => {
        if (!job.schedule?.serviceDate) {
          return false;
        }

        if (job.status === "completed" || job.status === "cancelled") {
          return false;
        }

        const jobDate = new Date(`${job.schedule.serviceDate}T00:00:00`);

        return jobDate >= today;
      })
      .sort((a, b) => {
        const dateA = new Date(
          `${a.schedule.serviceDate}T${a.schedule.startTime || "00:00"}`,
        );

        const dateB = new Date(
          `${b.schedule.serviceDate}T${b.schedule.startTime || "00:00"}`,
        );

        return dateA - dateB;
      });
  }, [jobs]);

  const recentRequests = useMemo(
    () =>
      [...requests]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5),
    [requests],
  );

  const attentionItems = useMemo(
    () => [
      ...unassignedJobs.slice(0, 3).map((job) => ({
        id: job.id,
        type: "job",
        code: job.jobCode,
        label: `${job.jobCode || "Job"} has no cleaner assigned`,
        href: `/admin/jobs/${job.id}`,
      })),

      ...newRequests.slice(0, 3).map((request) => ({
        id: request.id,
        type: "request",
        code: request.requestCode,
        label: `${request.requestCode || "Request"} is a new request`,
        href: `/admin/requests/${request.id}`,
      })),
    ],
    [unassignedJobs, newRequests],
  );

  return {
    requests,
    jobs,
    employees,

    newRequests,
    unassignedJobs,
    activeEmployees,
    upcomingJobs,
    recentRequests,
    attentionItems,

    loading,
    loadError,
  };
}
